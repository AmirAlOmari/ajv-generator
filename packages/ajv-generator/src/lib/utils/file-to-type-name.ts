export function fileToTypeName(fileName: string, prefix: 'Request' | 'Response'): string {
  const clearAndUpper = (text: string) => text.replace(/-/, '').toUpperCase();

  const sanitizedFileName = fileName.replace(/^.*__/, '');

  const part = sanitizedFileName
    .replace(/(^\w|-\w)/g, clearAndUpper)
    .replace(/\../g, (value) => value[1].toUpperCase())
    .split(':')[0];

  return `${part}${prefix}`;
}
