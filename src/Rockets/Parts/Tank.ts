import { Vector2 } from "../../Primitives/Vector2";

export type Tank = {
  type: "LOX" | "RP1" | "Methane" | "N2";

  offset: Vector2;

  width: number;
  height: number;

  propellent: number;
};
