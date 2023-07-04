import { Stage } from "../Rockets/Parts/RocketStage";
import { ICommand } from "./ICommand";

export class Gimble implements ICommand {
  start: number;
  duration: number;

  stage: Stage;
  angle: number;
  engineId: number;

  angularVelocity: number = 0;

  constructor(start: number, duration: number, stage: Stage, angle: number, engineId: number) {
    this.start = start;
    this.duration = duration;

    this.stage = stage;
    this.angle = angle;
    this.engineId = engineId;
  }

  init(): void {
    this.angularVelocity = (this.angle - this.stage.engines[this.engineId].gimble) / this.duration;
  }

  update(dt: number): void {
    this.stage.engines[this.engineId].gimble += this.angularVelocity * dt;
  }

  cancel(): void {}
}
