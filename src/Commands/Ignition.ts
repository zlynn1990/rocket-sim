import { Stage } from "../Rockets/Parts/RocketStage";
import { ICommand } from "./ICommand";

export class Ignition implements ICommand {
  start: number;
  duration: number;

  stage: Stage;
  throttle: number;
  engineId: number;

  constructor(start: number, duration: number, stage: Stage, throttle: number, engineId: number) {
    this.start = start;
    this.duration = duration;

    this.stage = stage;
    this.throttle = throttle;
    this.engineId = engineId;
  }

  init(): void {
    this.stage.engines[this.engineId].throttle = this.throttle;
  }

  update(dt: number): void {}

  cancel(): void {}
}
