import { load } from "../Common/TextureLoader";
import { generateCylindricalSurfaces, generateFlap } from "../Physics/SurfaceBuilder";
import { EngineConfig } from "./Configs/Engine";
import { Stage } from "./Parts/RocketStage";

export async function loadStarship(): Promise<Stage> {
  const raptor2: EngineConfig = {
    name: "Raptor 2 SL",
    mass: 1600,
    thrust: {
      sl: 2300000,
      vac: 2300000,
    },
    gimbleRange: 0.261799,
    throttle: {
      min: 0.2,
      max: 1.0,
    },
    massFlow: {
      sl: 680.2,
      vac: 590.7,
    },
  };

  return {
    name: "Starship",
    mass: 100000,
    texture: await load("./textures/rockets/starship/starship.png"),
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    rotation: 0.0,
    angularVelocity: 0,
    angularAcceleration: 0,
    width: 9,
    height: 50,
    surfaces: [
      ...generateCylindricalSurfaces(9, 50, 7),
      ...generateFlap(3.3, 8.72, Math.PI * 1.5, { x: 3.5, y: 8 }),
      ...generateFlap(4.2, 13.87, Math.PI * 1.5, { x: 3.5, y: 42.39 }),
      ...generateFlap(3.3, 8.72, Math.PI * 1.5, { x: 3.5, y: 8 }),
      ...generateFlap(4.2, 13.87, Math.PI * 1.5, { x: 3.5, y: 42.39 }),
    ],
    engines: [
      // Main engines
      {
        config: raptor2,
        offset: { x: 4.5, y: 50 },
        comLever: { direction: 0, magnitude: 0 },
        normal: Math.PI,
        gimble: 0.0,
        throttle: 0.0,
      },
      {
        config: raptor2,
        offset: { x: 4.5, y: 50 },
        comLever: { direction: 0, magnitude: 0 },
        normal: Math.PI,
        gimble: 0.0,
        throttle: 0.0,
      },
      {
        config: raptor2,
        offset: { x: 4.5, y: 50 },
        comLever: { direction: 0, magnitude: 0 },
        normal: Math.PI,
        gimble: 0.0,
        throttle: 0.0,
      },
    ],
    tanks: [],
  };
}
