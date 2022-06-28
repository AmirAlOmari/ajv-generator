import Path from 'path';

export function createAJVJsonPath(handlerFolderPath: string): string {
  const ajvJsonFolderPath = handlerFolderPath.replace('src', 'dist');
  const ajvJsonPath = Path.join(ajvJsonFolderPath, 'ajv.json');

  return ajvJsonPath;
}
