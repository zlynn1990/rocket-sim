import { Point } from "../../Primitives/Point";
import { Vector } from "../../Primitives/Vector";

export type Surface = {
  offset: Point;

  // The angle and distance from the center of mass.
  // Computed each update cycle for re-usability).
  comLever: Vector;

  normal: number;

  area: number;

  torque: number;
  dragCoefficient: number;
};
