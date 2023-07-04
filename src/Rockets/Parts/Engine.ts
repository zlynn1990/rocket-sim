import { Point } from "../../Primitives/Point";
import { Vector } from "../../Primitives/Vector";
import { EngineConfig } from "../Configs/Engine";

export type Engine = {
  config: EngineConfig;

  normal: number;
  offset: Point;

  gimble: number;
  throttle: number;

  // The angle and distance from the center of mass.
  // Computed each update cycle for re-usability).
  comLever: Vector;
};
