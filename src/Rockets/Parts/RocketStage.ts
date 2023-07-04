import { Engine } from "./Engine";
import { Point } from "../../Primitives/Point";
import { Surface } from "./Surface";
import { Tank } from "./Tank";
import { Vector2 } from "../../Primitives/Vector2";

export type Stage = {
  name: string;
  texture: ImageBitmap;

  mass: number;

  position: Point;
  velocity: Vector2;
  acceleration: Vector2;

  rotation: number;
  angularVelocity: number;
  angularAcceleration: number;

  width: number;
  height: number;

  surfaces: Surface[];
  engines: Engine[];
  tanks: Tank[];
};
