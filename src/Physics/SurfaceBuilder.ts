import { Angle } from "../Common/Angle";
import { Point } from "../Primitives/Point";
import { Surface } from "../Rockets/Parts/Surface";

export function generateFlap(width: number, height: number, normal: number, offset: Point): Surface[] {
  return [
    // Front of flap
    {
      offset,
      comLever: { direction: 0, magnitude: 0 },
      normal,
      area: width * height,
      torque: 0,
      dragCoefficient: 1.17,
    },
    // Back of flap
    {
      offset,
      comLever: { direction: 0, magnitude: 0 },
      normal: Angle.Reverse(normal),
      area: width * height,
      torque: 0,
      dragCoefficient: 1.17,
    },
  ];
}

export function generateCylindricalSurfaces(width: number, height: number, segments: number): Surface[] {
  const radius: number = width / 2;
  const segmentHeight = height / segments;

  let surfaces: Surface[] = [];

  // Top surface
  surfaces.push({
    offset: { x: radius, y: 0 },
    comLever: { direction: 0, magnitude: 0 },
    normal: 0,
    area: 2 * Math.PI * radius * radius,
    torque: 0,
    dragCoefficient: 1.12,
  });

  // Bottom surface
  surfaces.push({
    offset: { x: radius, y: height },
    comLever: { direction: 0, magnitude: 0 },
    normal: Math.PI,
    area: 2 * Math.PI * radius * radius,
    torque: 0,
    dragCoefficient: 1.12,
  });

  // Left surfaces
  for (let i = 0; i < segments; i++) {
    surfaces.push({
      offset: { x: 0, y: i * segmentHeight + segmentHeight / 2 },
      comLever: { direction: 0, magnitude: 0 },
      normal: Math.PI * 1.5,
      area: Math.PI * radius * segmentHeight,
      torque: 0,
      dragCoefficient: 1.21,
    });
  }

  // Right surfaces
  for (let i = 0; i < segments; i++) {
    surfaces.push({
      offset: { x: width, y: i * segmentHeight + segmentHeight / 2 },
      comLever: { direction: 0, magnitude: 0 },
      normal: Math.PI * 0.5,
      area: Math.PI * radius * segmentHeight,
      torque: 0,
      dragCoefficient: 1.21,
    });
  }

  return surfaces;
}
