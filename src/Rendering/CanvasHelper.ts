import { CanvasHeight, CanvasWidth, TwoPi } from "../Constants";
import { Point } from "../Primitives/Point";
import { Vector2 } from "../Primitives/Vector2";

export function fill(context: CanvasRenderingContext2D, color: string) {
  context.globalAlpha = 1.0;
  context.globalCompositeOperation = "source-over";
  context.fillStyle = color;
  context.fillRect(0, 0, CanvasWidth, CanvasHeight);
}

export function drawCircle(
  context: CanvasRenderingContext2D,
  position: Point,
  radius: number,
  color: string | CanvasGradient,
  startAngle: number = 0,
  endAngle: number = TwoPi
) {
  context.beginPath();
  context.arc(position.x, position.y, radius, startAngle, endAngle, false);
  context.fillStyle = color;
  context.fill();
}

export function drawImage(context: CanvasRenderingContext2D, image: ImageBitmap, position: Vector2, rotation: number, scale: number) {
  context.save();
  context.translate(500, 500);
  context.rotate(rotation);
  context.drawImage(image, -image.width / 2, -image.height, image.width, image.height);
  context.restore();
}
