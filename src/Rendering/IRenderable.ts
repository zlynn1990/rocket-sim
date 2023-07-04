import { Camera } from "../Camera/Camera";

export interface IRenderable {
  render(context: CanvasRenderingContext2D, camera: Camera): void;
}
