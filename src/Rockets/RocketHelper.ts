import { Angle } from "../Common/Angle";
import { VectorHelper } from "../Common/VectorHelper";
import { Stage } from "./Parts/RocketStage";
import { Vector2 } from "../Primitives/Vector2";
import { Camera } from "../Camera/Camera";
import { IPlanet } from "../Planets/IPlanet";

export function computeAltitude(stage: Stage, planet: IPlanet): number {
  const distance: number = VectorHelper.Length({ x: planet.position.x - stage.position.x, y: planet.position.y - stage.position.y });

  return distance - planet.surfaceRadius;
}

export function computeMass(stage: Stage): { mass: number; com: Vector2 } {
  // Start the mass as the stage dry weight
  let mass: number = stage.mass;
  const com: Vector2 = { x: stage.width * 0.5 * stage.mass, y: stage.height * 0.5 * stage.mass };

  for (let engine of stage.engines) {
    mass += engine.config.mass;

    com.x += engine.offset.x * engine.config.mass;
    com.y += engine.offset.y * engine.config.mass;
  }

  // Take weighted average for com
  com.x /= mass;
  com.y /= mass;

  return { mass, com };
}

// Initial levers for re-used computations
export function initializeComLevers(stage: Stage, com: Vector2): void {
  for (let surface of stage.surfaces) {
    const leverOffset: Vector2 = VectorHelper.Subtract(com, surface.offset);

    surface.comLever = {
      direction: Angle.Normalize(Angle.FromVector(leverOffset) + stage.rotation),
      magnitude: VectorHelper.Length(leverOffset),
    };

    surface.torque = 0;
  }

  for (let engine of stage.engines) {
    const leverOffset: Vector2 = VectorHelper.Subtract(com, engine.offset);

    engine.comLever = {
      direction: Angle.Normalize(Angle.FromVector(leverOffset) + stage.rotation),
      magnitude: VectorHelper.Length(leverOffset),
    };
  }
}

export function drawStage(stage: Stage, context: CanvasRenderingContext2D, camera: Camera): void {}
