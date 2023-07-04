import { Camera } from "../Camera/Camera";
import { VectorHelper } from "../Common/VectorHelper";
import { CanvasHeight, CanvasWidth, TwoPi } from "../Constants";
import { Point } from "../Primitives/Point";
import { Vector2 } from "../Primitives/Vector2";
import { drawCircle } from "../Rendering/CanvasHelper";
import { IPlanet } from "./IPlanet";

export class Earth implements IPlanet {
  position: Point = { x: 0, y: 0 };
  mass: number = 5.97219e24;

  surfaceRadius: number = 6.371e6;
  atmosphereHeight: number = 1.5e5;

  ispMultiplier(altitude: number): number {
    const heightRatio = Math.max(altitude / this.atmosphereHeight, 0);

    return 1.0 - Math.exp(-21.3921 * heightRatio);
  }

  atmosphericDensity(altitude: number): number {
    if (altitude > this.atmosphereHeight || altitude < 0) return 0;

    let temperature: number = 0;
    let pressure: number = 0;

    if (altitude > 25000) {
      temperature = -131.21 + 0.00299 * altitude;

      pressure = 2.448 * Math.pow((temperature + 273.1) / 216.6, -11.388);
    } else if (altitude > 11000) {
      temperature = -56.46;

      pressure = 22.65 * Math.exp(1.73 - 0.000157 * altitude);
    } else {
      temperature = 15.04 - 0.00649 * altitude;

      pressure = 101.29 * Math.pow((temperature + 273.1) / 288.08, 5.256);
    }

    return pressure / (0.2869 * (temperature + 273.1));
  }

  render(context: CanvasRenderingContext2D, camera: Camera): void {
    context.save();

    context.translate(CanvasWidth / 2, CanvasHeight / 2);
    context.scale(camera.Zoom, camera.Zoom);

    const atmosphereRadius = this.surfaceRadius + this.atmosphereHeight;

    const center: Vector2 = VectorHelper.Subtract(this.position, camera.Position);

    // Draw a space to blue sky gradient
    var atmosphericGradient = context.createRadialGradient(center.x, center.y, this.surfaceRadius, center.x, center.y, atmosphereRadius);
    atmosphericGradient.addColorStop(0, "rgba(85, 136, 231, 1.0)");
    atmosphericGradient.addColorStop(0.3, "rgba(85, 136, 231, 0.4)");
    atmosphericGradient.addColorStop(1, "rgba(85, 136, 231, 0.01)");

    drawCircle(context, center, atmosphereRadius, atmosphericGradient);

    // Draw a green to dark green earth gradient
    var surfaceGradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, this.surfaceRadius);
    surfaceGradient.addColorStop(0, "rgb(28, 119, 58)");
    surfaceGradient.addColorStop(1, "rgb(62, 166, 81)");

    drawCircle(context, center, this.surfaceRadius, surfaceGradient);

    // Draw shaded gradient for night/day
    const lightAngle: number = 0.4;

    var shadowGradient = context.createLinearGradient(
      center.x,
      center.y,
      center.x + Math.cos(lightAngle) * atmosphereRadius,
      center.y + Math.sin(lightAngle) * atmosphereRadius
    );

    shadowGradient.addColorStop(0, "rgba(100,100,100, 0.0");
    shadowGradient.addColorStop(0.2, "rgba(50,50,50, 1.0");
    shadowGradient.addColorStop(1, "rgba(25,25,25, 1.0");

    //context.globalCompositeOperation = "multiply";
    //drawCircle(context, center, atmosphereRadius, shadowGradient, lightAngle, lightAngle + TwoPi);

    context.restore();
  }
}
