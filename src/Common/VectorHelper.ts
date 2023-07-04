import { Vector2 } from "../Primitives/Vector2";

export class VectorHelper {
  static Normalize(input: Vector2): Vector2 {
    const length: number = this.Length(input);

    return { x: input.x / length, y: input.y / length };
  }

  static Multiply(input: Vector2, scalar: number): Vector2 {
    return { x: input.x * scalar, y: input.y * scalar };
  }

  static Length(input: Vector2): number {
    return Math.sqrt(input.x * input.x + input.y * input.y);
  }

  static LengthSquared(input: Vector2): number {
    return input.x * input.x + input.y * input.y;
  }

  static Add(v1: Vector2, v2: Vector2): Vector2 {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }

  static Subtract(v1: Vector2, v2: Vector2): Vector2 {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  }

  static Dot(v1: Vector2, v2: Vector2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }
}
