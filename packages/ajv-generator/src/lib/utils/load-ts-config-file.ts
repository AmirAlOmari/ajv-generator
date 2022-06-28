import Path from 'path';
import ts from 'typescript';

export function loadTsConfigFile(tsConfigFilePath: string) {
  const raw = ts.sys.readFile(tsConfigFilePath);
  if (raw) {
    const config = ts.parseConfigFileTextToJson(tsConfigFilePath, raw);

    if (config.error) {
      throw new Error(`Some error: ${config.error}`);
    } else if (!config.config) {
      throw new Error(`Invalid parsed config file "${tsConfigFilePath}"`);
    }

    const parseResult = ts.parseJsonConfigFileContent(
      config.config,
      ts.sys,
      Path.resolve(Path.dirname(tsConfigFilePath)),
      {},
      tsConfigFilePath,
    );
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;
    delete parseResult.options.declarationDir;
    delete parseResult.options.declarationMap;

    return parseResult;
  }
  throw new Error('No tsconfig');
}
