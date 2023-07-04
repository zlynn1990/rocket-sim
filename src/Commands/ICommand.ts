export interface ICommand {
  start: number;
  duration: number;

  init(): void;
  update(dt: number): void;
  cancel(): void;
}
