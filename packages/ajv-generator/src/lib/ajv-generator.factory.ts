import type * as TSJ from 'ts-json-schema-generator';
import glob from 'glob-promise';
import ts from 'typescript';
import { createFormatter, createParser } from 'ts-json-schema-generator';

import { CustomSchemaGenerator } from './custom-schema-generator';
import { AjvGenerator } from './ajv-generator';
import { loadTsConfigFile } from './utils';

export class AjvGeneratorFactory {
  public async create(carotteTargetsGlob: string, tsConfigPath: string) {
    const handlerPaths = await glob(carotteTargetsGlob);
    const neededTsConfig = loadTsConfigFile(tsConfigPath);

    const tsjConfig: TSJ.Config = {
      path: carotteTargetsGlob,
      tsconfig: tsConfigPath,
      expose: 'none',
      type: '*',
    };

    const program = ts.createProgram({
      rootNames: handlerPaths,
      options: neededTsConfig.options,
    });
    const parser = createParser(program, tsjConfig);
    const formatter = createFormatter(tsjConfig);
    const generator = new CustomSchemaGenerator(program, parser, formatter, tsjConfig);

    return new AjvGenerator(program, generator);
  }
}
