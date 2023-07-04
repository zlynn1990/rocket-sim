import { Angle } from "../Common/Angle";
import { Stage } from "../Rockets/Parts/RocketStage";
import { Surface } from "../Rockets/Parts/Surface";
import { Vector } from "../Primitives/Vector";
import { Vector2 } from "../Primitives/Vector2";
import { VectorHelper } from "../Common/VectorHelper";
import { IMassiveBody } from "./IMassiveBody";

// https://study.com/skill/learn/how-to-calculate-the-moment-of-inertia-for-a-cylinder-explanation.html
export function momentOfInertia(mass: number, radius: number, height: number): number {
  return 0.08 * mass * (3 * radius * radius + height * height);
}

export function computeForces(lever: Vector, force: Vector): { torque: number; linear: Vector2 } {
  // The angle between the force and lever from the center of mass. If the force acts
  // perpendicular against the lever it will be at 90 and apply max torque
  const forceAngle: number = lever.direction - force.direction;

  // T = rFsin(theta) https://www.google.com/search?q=torque+formula
  const torque: number = -force.magnitude * lever.magnitude * Math.sin(forceAngle);

  // The amount of linear force generated at it's angle to the center of mass. If the force
  // is directly aligned with the center of mass cos(0) = 1 and the force applies max linear velocity.
  const linearScalar: number = Math.cos(forceAngle);

  // Linear force in angular components
  const linear: Vector2 = {
    x: force.magnitude * Math.sin(lever.direction) * linearScalar,
    y: -force.magnitude * Math.cos(lever.direction) * linearScalar,
  };

  return { torque, linear };
}

export function reverseSolve(torque: number, lever: Vector): number {
  return torque / lever.magnitude;
}

export function computeAngularVelocity(stage: Stage, surface: Surface): Vector {
  // The distance and direction from the center of mass
  const comLever: Vector = surface.comLever;

  if (stage.angularVelocity > 0) {
    return { direction: Angle.Normalize(comLever.direction - Math.PI / 2), magnitude: comLever.magnitude * stage.angularVelocity };
  }

  return { direction: Angle.Normalize(comLever.direction + Math.PI / 2), magnitude: -comLever.magnitude * stage.angularVelocity };
}

export function computeGravity(position: Vector2, body: IMassiveBody): Vector2 {
  const difference: Vector2 = VectorHelper.Subtract(body.position, position);

  const r2: number = VectorHelper.LengthSquared(difference);
  const massDistanceRatio: number = body.mass / r2;

  const direction: Vector2 = VectorHelper.Normalize(difference);

  // Gravitation ( aG = G m1 / r^2 )
  // Hardcoded to earth for now
  return { x: direction.x * 6.67384e-11 * massDistanceRatio, y: direction.y * 6.67384e-11 * massDistanceRatio };
}
