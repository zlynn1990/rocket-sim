import { IMassiveBody } from "../Physics/IMassiveBody";
import { IRenderable } from "../Rendering/IRenderable";

export interface IPlanet extends IMassiveBody, IRenderable {
  atmosphereHeight: number;
  surfaceRadius: number;

  ispMultiplier(altitude: number): number;
  atmosphericDensity(altitude: number): number;
}
