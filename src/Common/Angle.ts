import { TwoPi } from "../Constants";
import { Point } from "../Primitives/Point";

export class Angle {
  static FromVector(vector: Point) {
    return this.Normalize(Math.atan2(vector.y, vector.x) + Math.PI / 2);
  }

  static Difference(a1: number, a2: number): number {
    const difference = Math.abs(a1 - a2) % TwoPi;

    if (difference > Math.PI) {
      return TwoPi - difference;
    }

    return difference;
  }

  static Normalize(angle: number): number {
    const moddedAngle = angle % TwoPi;

    if (moddedAngle < 0) {
      return moddedAngle + TwoPi;
    }

    return moddedAngle;
  }

  static Reverse(angle: number): number {
    return this.Normalize(angle + Math.PI);
  }

  static Reflect(angle: number, normal: number): number {
    const difference = (angle - normal) % TwoPi;

    return this.Normalize(normal - difference);
  }

  static Perpendicular(angle1: number, angle2: number): boolean {
    return Angle.Difference(angle1, angle2) > Math.PI / 2;
  }
}
