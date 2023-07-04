import "./App.css";
import React, { useEffect, useRef } from "react";
import { CanvasWidth, CanvasHeight, Epsilon } from "./Constants";
import { FpsManager } from "./FpsManager";
import { getNumberFromQueryString } from "./Utilities";
import { fill } from "./Rendering/CanvasHelper";
import { Stage } from "./Rockets/Parts/RocketStage";
import { Vector2 } from "./Primitives/Vector2";
import { Camera } from "./Camera/Camera";
import { VectorHelper } from "./Common/VectorHelper";
import { Angle } from "./Common/Angle";
import { computeAngularVelocity, computeForces, computeGravity, momentOfInertia } from "./Physics/Utils";
import { Vector } from "./Primitives/Vector";
import { loadF9 } from "./Rockets/F9S1";
import { UnitDisplay } from "./Rendering/UnitDisplay";
import { Earth } from "./Planets/Earth";
import { computeAltitude, computeMass, initializeComLevers } from "./Rockets/RocketHelper";
import { IPlanet } from "./Planets/IPlanet";
import { EngineConfig } from "./Rockets/Configs/Engine";
import { drawText, TextGroup } from "./Rendering/TextDisplay";
import { Ignition } from "./Commands/Ignition";
import { IController } from "./Controllers/IController";
import { CommandController } from "./Controllers/CommandController";
import { Gimble } from "./Commands/Gimble";

// Total time of simulation
let elapsedTime: number = 0;
const deltaTime = getNumberFromQueryString("deltaTime", 1.0 / 60.0);

const stages: Stage[] = [];
const planet: IPlanet = new Earth();

let context: CanvasRenderingContext2D | null;
let fpsManager = new FpsManager();

let camera = new Camera({ x: 0, y: 0 });

let controller: IController | undefined = undefined;

function render(timeStamp: number) {
  if (context === null) return;

  // Disable controller for now
  if (controller) {
    //controller.update(elapsedTime, deltaTime);
  }

  for (let stage of stages) {
    const altitude: number = computeAltitude(stage, planet);

    // Update mass and center of mass / moment
    const { mass, com } = computeMass(stage);
    const moment: number = momentOfInertia(mass, stage.width * 0.5, stage.height);

    // Initial levers for re-used computations
    initializeComLevers(stage, com);

    const aeroVectors: Vector[] = [
      // Wind - Optional force (could be altitude dependant)
      // { direction: Math.PI * 0.5, magnitude: 10 },
      // Stage velocity
      { direction: Angle.Reverse(Angle.FromVector(stage.velocity)), magnitude: VectorHelper.Length(stage.velocity) },
    ];

    let maxTorque = 1;

    // Reset acceleration
    stage.acceleration.x = 0;
    stage.acceleration.y = 0;
    stage.angularAcceleration = 0;

    // Air density and ISP scalar
    const airDensity: number = planet.atmosphericDensity(altitude);
    const ispMultiplier: number = planet.ispMultiplier(altitude);

    // Aero forces
    for (let aero of aeroVectors) {
      if (aero.magnitude < Epsilon) continue;

      for (let surface of stage.surfaces) {
        // Real angle of the surfaces projected into world coordinates
        const surfaceNormal: number = surface.normal + stage.rotation;
        const crossProduct: number = Math.cos(surfaceNormal - aero.direction);

        // Angle of the aero force is effecting the surface
        if (crossProduct < 0 && Math.abs(crossProduct) > Epsilon) {
          // F = 0.5CpAv^2
          const drag = 0.5 * surface.dragCoefficient * airDensity * surface.area * aero.magnitude * aero.magnitude * Math.abs(crossProduct);

          const { torque, linear } = computeForces(surface.comLever, { direction: aero.direction, magnitude: drag });

          stage.angularAcceleration -= torque / moment;

          stage.acceleration.x += linear.x / mass;
          stage.acceleration.y += linear.y / mass;

          // For visualization purposes
          surface.torque = Math.abs(torque);
          maxTorque = Math.max(surface.torque, maxTorque);
        }
      }
    }

    // Rotational forces against air
    for (let surface of stage.surfaces) {
      // Gets the angular velocity at the provided surface
      const { direction, magnitude } = computeAngularVelocity(stage, surface);

      if (magnitude < Epsilon) continue;

      // Real angle of the surfaces projected into world coordinates
      const surfaceNormal: number = surface.normal + stage.rotation;
      const crossProduct = Math.cos(surfaceNormal - direction);

      // Angle of the aero force is effecting the surface
      if (crossProduct > 0 && Math.abs(crossProduct) > Epsilon) {
        // F = 0.5CpAv^2
        const drag = 0.5 * surface.dragCoefficient * airDensity * surface.area * magnitude * magnitude;

        // The force against the air should be the opposite of the direction the stage rotates against the air
        const { torque, linear } = computeForces(surface.comLever, { direction: Angle.Reverse(direction), magnitude: drag });

        stage.angularAcceleration -= torque / moment;

        stage.acceleration.x += linear.x / mass;
        stage.acceleration.y += linear.y / mass;

        // For visualization purposes
        surface.torque = Math.abs(torque);
        maxTorque = Math.max(surface.torque, maxTorque);
      }
    }

    for (let engine of stage.engines) {
      if (engine.throttle < Epsilon) continue;

      const config: EngineConfig = engine.config;

      const thrust = (config.thrust.sl * (1.0 - ispMultiplier) + config.thrust.vac * ispMultiplier) * engine.throttle;

      // Angle of thrust in world coordinates, thrust acts against the stage so the angle must be reversed
      const thrustAngle: number = Angle.Normalize(stage.rotation + Angle.Reverse(engine.normal + engine.gimble));

      const { torque, linear } = computeForces(engine.comLever, { direction: thrustAngle, magnitude: thrust });

      stage.angularAcceleration -= torque / moment;

      stage.acceleration.x += linear.x / mass;
      stage.acceleration.y += linear.y / mass;

      stage.mass -= (config.massFlow.sl * (1.0 - ispMultiplier) + config.massFlow.vac * ispMultiplier) * engine.throttle * deltaTime;
    }

    // Add gravity
    const gravity: Vector2 = computeGravity(stage.position, planet);

    const linearAcceleration: Vector2 = {
      x: stage.acceleration.x + gravity.x,
      y: stage.acceleration.y + gravity.y,
    };

    // Step linear acceleration
    stage.velocity.x += linearAcceleration.x * deltaTime;
    stage.velocity.y += linearAcceleration.y * deltaTime;

    // Step linear velocity
    stage.position.x += stage.velocity.x * deltaTime;
    stage.position.y += stage.velocity.y * deltaTime;

    // Step angular momentum
    stage.angularVelocity += stage.angularAcceleration * deltaTime;
    stage.rotation += stage.angularVelocity * deltaTime;

    // Normalize torque visuals
    for (let surface of stage.surfaces) {
      surface.torque /= maxTorque;
    }
  }

  elapsedTime += deltaTime;

  const targetStage: Stage = stages[0];

  // Clear the frame
  fill(context, `rgb(0, 0, 0 )`);

  camera.updateTarget(targetStage.position);

  planet.render(context, camera);

  camera.render(context, stages);

  fpsManager.update(timeStamp);

  const { mass } = computeMass(targetStage);

  let fps: number = fpsManager.Current;

  const textGroups: TextGroup[] = [
    {
      contents: [`FPS: ${fps}`, `Time: ${elapsedTime.toFixed(1)}`],
    },
    {
      contents: [
        `Altitude: ${UnitDisplay.Distance(computeAltitude(targetStage, planet))}`,
        `Velocity: ${UnitDisplay.Speed(VectorHelper.Length(targetStage.velocity))}`,
        `Rotation: ${UnitDisplay.Degrees(targetStage.rotation, true)} °`,
      ],
    },
    {
      contents: [
        `Linear Acceleration: ${UnitDisplay.Acceleration(VectorHelper.Length(targetStage.acceleration))}`,
        `Angular Acceleration: ${UnitDisplay.Degrees(targetStage.angularAcceleration)} °`,
      ],
    },
    {
      contents: [`Vertical: ${UnitDisplay.Speed(targetStage.velocity.y)}`, `Horizontal: ${UnitDisplay.Speed(targetStage.velocity.x)}`],
    },
    {
      contents: [`Mass: ${UnitDisplay.Mass(mass)}`],
    },
  ];

  drawText(context, textGroups);

  window.requestAnimationFrame(render);
}

function App() {
  const outputCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (outputCanvas.current) {
      context = outputCanvas.current.getContext("2d");
      if (context) {
        loadF9().then((stage: Stage) => {
          stage.velocity.x = 100;
          stage.position.y = -planet.surfaceRadius - 50000;

          //stage.rotation = Math.PI * 1.5;

          // stage.engines[3].throttle = 0.9;
          // stage.engines[3].gimble = -0.001;

          stages.push(stage);

          controller = new CommandController([
            new Gimble(0, 1, stage, -0.261799, 0),
            new Ignition(1, 1, stage, 1.0, 0),
            new Gimble(1, 4, stage, 0.26, 0),
            new Gimble(5, 7, stage, -0.14, 0),
            new Gimble(11, 10, stage, 0.0, 0),
          ]);

          window.requestAnimationFrame(render);
        });
      }
    }
  }, [outputCanvas]);

  return (
    <div className="App">
      <canvas ref={outputCanvas} width={CanvasWidth} height={CanvasHeight} />
    </div>
  );
}

export default App;
