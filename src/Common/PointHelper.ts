import { Epsilon } from "../Constants";
import { Point } from "../Primitives/Point";

export class PointHelper {
    static Equal(p1: Point, p2: Point): boolean {
        return Math.abs(p1.x - p2.x) < Epsilon && Math.abs(p1.y - p2.y) < Epsilon;
    }

    static Distance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
}