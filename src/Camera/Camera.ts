import { CanvasHeight, CanvasWidth } from "../Constants";
import { Stage } from "../Rockets/Parts/RocketStage";
import { Point } from "../Primitives/Point";
import { drawCircle } from "../Rendering/CanvasHelper";
import { VectorHelper } from "../Common/VectorHelper";
import { computeMass } from "../Rockets/RocketHelper";

export class Camera {
  public Position: Point;

  public Zoom: number = 10;

  constructor(position: Point) {
    this.Position = position;

    window.addEventListener("keypress", (e) => {
      if (e.key === "=") {
        this.Zoom *= 1.1;
      }

      if (e.key === "-") {
        this.Zoom *= 0.9;
      }
    });
  }

  updateTarget(position: Point) {
    this.Position = position;
  }

  render(context: CanvasRenderingContext2D, stages: Stage[]) {
    for (let stage of stages) {
      const { com } = computeMass(stage);

      context.save();

      context.translate(CanvasWidth / 2, CanvasHeight / 2);
      context.rotate(stage.rotation);
      context.scale(this.Zoom, this.Zoom);

      context.drawImage(stage.texture, -com.x, -com.y, stage.width, stage.height);

      // Center of mass indicator
      drawCircle(context, { x: 0, y: 0 }, 1, "red");

      for (let surface of stage.surfaces) {
        drawCircle(context, VectorHelper.Subtract(surface.offset, com), 0.1 + 1 * surface.torque, "yellow");
      }

      for (let engine of stage.engines) {
        drawCircle(context, VectorHelper.Subtract(engine.offset, com), 0.5, "green");
      }

      context.restore();
    }
  }
}
