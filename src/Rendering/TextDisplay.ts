export type TextGroup = {
  contents: string[];
};

export function drawText(context: CanvasRenderingContext2D, groups: TextGroup[]): void {
  context.font = "20px Georgia";
  context.fillStyle = "white";

  let verticalOffset: number = 30;

  for (let group of groups) {
    for (let content of group.contents) {
      context.fillText(content, 10, verticalOffset);

      if (content.length > 1) verticalOffset += 30;
    }

    verticalOffset += 20;
  }
}
