import { ICommand } from "../Commands/ICommand";
import { IController } from "./IController";

export class CommandController implements IController {
  activeCommands: ICommand[] = [];
  queuedCommands: ICommand[] = [];

  constructor(commands: ICommand[]) {
    this.queuedCommands.push(...commands);
  }

  update(time: number, dt: number): void {
    // Manage active commands
    for (let i = 0; i < this.activeCommands.length; i++) {
      const command: ICommand = this.activeCommands[i];

      if (command.start + command.duration <= time) {
        command.cancel();

        this.activeCommands.splice(i--, 1);
      } else {
        command.update(dt);
      }
    }

    // Queue new commands
    for (let i = 0; i < this.queuedCommands.length; i++) {
      const command: ICommand = this.queuedCommands[i];

      if (command.start <= time) {
        command.init();

        this.activeCommands.push(command);
        this.queuedCommands.splice(i--, 1);
      }
    }
  }
}
