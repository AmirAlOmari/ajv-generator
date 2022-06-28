/* eslint-disable max-classes-per-file */
import type { AjvJson } from './ajv-json.type';

export abstract class AjvGenerationHandlerAbstractResult {
  constructor(
    public readonly $type: 'LEFT' | 'RIGHT',
    public readonly handlerPath: string,
    public readonly handlerFileName: string,
    public readonly requestTypeNames: string[],
    public readonly responseTypeNames: string[],
  ) {}
}

export class AjvGenerationHandlerRightResult extends AjvGenerationHandlerAbstractResult {
  constructor(
    public readonly handlerPath: string,
    public readonly handlerFileName: string,
    public readonly requestTypeNames: string[],
    public readonly responseTypeNames: string[],
    public readonly ajvJson: AjvJson,
  ) {
    super('RIGHT', handlerPath, handlerFileName, requestTypeNames, responseTypeNames);
  }
}

export abstract class AjvGenerationHandlerLeftResult extends AjvGenerationHandlerAbstractResult {
  constructor(
    public readonly handlerPath: string,
    public readonly handlerFileName: string,
    public readonly requestTypeNames: string[],
    public readonly responseTypeNames: string[],
    public readonly hasRequestNode?: boolean,
    public readonly hasResponseNode?: boolean,
  ) {
    super('LEFT', handlerPath, handlerFileName, requestTypeNames, responseTypeNames);
  }
}

export class AjvGenerationHandlerCouldNotFindSourceFileResult extends AjvGenerationHandlerLeftResult {}

export class AjvGenerationHandlerCouldNotFindReustOrReponseNodeResult extends AjvGenerationHandlerLeftResult {}

export type AjvGenerationHandlerResult =
  | AjvGenerationHandlerLeftResult
  | AjvGenerationHandlerRightResult;
