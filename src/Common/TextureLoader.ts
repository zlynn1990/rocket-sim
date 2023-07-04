export async function load(url: string): Promise<ImageBitmap> {
  const response: Response = await fetch(url);
  const blob: Blob = await response.blob();

  return await createImageBitmap(blob);
}
