import Chalk from 'chalk';
import Path from 'path';
import glob from 'glob-promise';

import type { ExitCode } from '../exit-code.type';
import { Logger } from '../logger';
import { AjvGeneratorFactory } from '../ajv-generator.factory';
import {
  AjvGenerationHandlerResult,
  AjvGenerationHandlerLeftResult,
  AjvGenerationHandlerCouldNotFindSourceFileResult,
  AjvGenerationHandlerCouldNotFindReustOrReponseNodeResult,
} from '../ajv-generator.result';

export const CAROTTE_TARGETS_GLOB = 'src/{controllers,lambdas,listeners}/*/handler.ts';
export const TS_CONFIG_PATH = Path.resolve(process.cwd(), 'tsconfig.build.json');

export async function run(
  carotteTargetsGlob: string = CAROTTE_TARGETS_GLOB,
  tsConfigPath: string = TS_CONFIG_PATH,
) {
  const logger = new Logger();

  return new Runner(logger).run(carotteTargetsGlob, tsConfigPath);
}

export class Runner {
  constructor(private readonly logger: Logger) {}

  public async run(carotteTargetsGlob: string, tsConfigPath: string): Promise<ExitCode> {
    const handlerPaths = await glob(carotteTargetsGlob);

    const ajvGeneratorFactory = new AjvGeneratorFactory();
    const ajvGenerator = await ajvGeneratorFactory.create(carotteTargetsGlob, tsConfigPath);

    const handlerResults = await ajvGenerator.generate(handlerPaths);
    const hasLeftResults = handlerResults.some(
      (handlerResult) => handlerResult instanceof AjvGenerationHandlerLeftResult,
    );

    this.printReport(handlerResults);

    if (hasLeftResults) {
      return 1;
    }

    return 0;
  }

  private async printReport(handlerResults: AjvGenerationHandlerResult[]) {
    const schemaEmojiFactor = (exists = false) => (exists ? '✅' : '❌');

    handlerResults.forEach((result) => {
      if (result instanceof AjvGenerationHandlerCouldNotFindSourceFileResult) {
        this.logger.error(Chalk.bold(`Could not find source file for "${result.handlerFileName}"`));
        this.logger.error(`[📂] In "${result.handlerPath}"`);
        this.logger.log();
      }

      if (result instanceof AjvGenerationHandlerCouldNotFindReustOrReponseNodeResult) {
        this.logger.error(
          Chalk.bold(`Could not find request or response node for "${result.handlerFileName}"`),
        );
        this.logger.error(`[📂] In "${result.handlerPath}"`);
        this.logger.error(
          `- ${schemaEmojiFactor(
            result.hasRequestNode,
          )} Request, looked for any: ${result.requestTypeNames.join(', ')}`,
        );
        this.logger.error(
          `- ${schemaEmojiFactor(
            result.hasResponseNode,
          )} Response, looked for any: ${result.responseTypeNames.join(', ')}`,
        );
        this.logger.log();
      }
    });
  }
}
