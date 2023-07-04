import { load } from "../Common/TextureLoader";
import { generateCylindricalSurfaces } from "../Physics/SurfaceBuilder";
import { EngineConfig } from "./Configs/Engine";
import { Engine } from "./Parts/Engine";
import { Stage } from "./Parts/RocketStage";

export async function loadF9(): Promise<Stage> {
  const engines: Engine[] = [];

  const merlin1D: EngineConfig = {
    name: "Merlin 1D",
    mass: 4700,
    thrust: {
      sl: 854000,
      vac: 914000,
    },
    gimbleRange: 0.0872665,
    throttle: {
      min: 0.57,
      max: 1.0,
    },
    massFlow: {
      sl: 305.76,
      vac: 299.88,
    },
  };

  const n2Thruster: EngineConfig = {
    name: "N2 RCS",
    mass: 15,
    thrust: {
      sl: 2000,
      vac: 2500,
    },
    gimbleRange: 0,
    throttle: {
      min: 1.0,
      max: 1.0,
    },
    massFlow: {
      sl: 30,
      vac: 25,
    },
  };

  // Load 9 engines
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      engines.push({
        config: merlin1D,
        offset: { x: x * 2.055, y: 47.812188 },
        comLever: { direction: 0, magnitude: 0 },
        normal: Math.PI,
        gimble: 0.0,
        throttle: 0.0,
      });
    }
  }

  // Left RCS
  engines.push({
    config: n2Thruster,
    offset: { x: 0, y: 7.5 },
    comLever: { direction: 0, magnitude: 0 },
    normal: Math.PI * 1.5,
    gimble: 0.0,
    throttle: 0.0,
  });

  // Right RCS
  engines.push({
    config: n2Thruster,
    offset: { x: 4.11, y: 7.5 },
    comLever: { direction: 0, magnitude: 0 },
    normal: Math.PI * 0.5,
    gimble: 0.0,
    throttle: 0.0,
  });

  const f9: Stage = {
    name: "Falcon 9 Booster",
    mass: 21370 + 2800,
    texture: await load("./textures/rockets/falcon9/booster.png"),
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    rotation: 0.0,
    angularVelocity: 0,
    angularAcceleration: 0,
    width: 4.11,
    height: 47.812188,
    surfaces: generateCylindricalSurfaces(4.11, 47.812188, 15),
    engines,
    tanks: [],
  };

  return f9;
}
