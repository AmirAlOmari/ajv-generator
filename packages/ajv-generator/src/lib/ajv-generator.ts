import ts from 'typescript';
import Path from 'path';
import * as FS from 'fs/promises';

import type { AjvJson } from './ajv-json.type';
import type { CustomSchemaGeneratorInterface } from './custom-schema-generator.interface';
import { SHORT_REQUEST_TYPE_NAME, SHORT_RESPONSE_TYPE_NAME } from './constants';
import {
  AjvGenerationHandlerRightResult,
  AjvGenerationHandlerCouldNotFindSourceFileResult,
  AjvGenerationHandlerCouldNotFindReustOrReponseNodeResult,
  AjvGenerationHandlerResult,
} from './ajv-generator.result';
import { createAJVJsonPath, fileToTypeName, getFromMap } from './utils';

export class AjvGenerator {
  constructor(
    private readonly program: ts.Program,
    private readonly generator: CustomSchemaGeneratorInterface,
  ) {}

  public async generate(handlerPaths: string[]): Promise<AjvGenerationHandlerResult[]> {
    return Promise.all(
      handlerPaths.map(async (handlerPath) => {
        const handlerFolderPath = Path.dirname(handlerPath);
        const [handlerFileName] = handlerFolderPath.split('/').splice(-1);
        const handlerVerboseRequestTypeName = fileToTypeName(handlerFileName, 'Request');
        const requestTypeNames = [handlerVerboseRequestTypeName, SHORT_REQUEST_TYPE_NAME];
        const handlerVerboseResponseTypeName = fileToTypeName(handlerFileName, 'Response');
        const responseTypeNames = [handlerVerboseResponseTypeName, SHORT_RESPONSE_TYPE_NAME];

        const sourceFile = this.program.getSourceFile(handlerPath);

        if (!sourceFile) {
          return new AjvGenerationHandlerCouldNotFindSourceFileResult(
            handlerPath,
            handlerFileName,
            requestTypeNames,
            responseTypeNames,
          );
        }

        const nameToNodeMap = this.generator.buildNameToNodeMap(sourceFile);

        const requestNode = getFromMap(requestTypeNames, nameToNodeMap);
        const responseNode = getFromMap(responseTypeNames, nameToNodeMap);

        if (!requestNode || !responseNode) {
          return new AjvGenerationHandlerCouldNotFindReustOrReponseNodeResult(
            handlerPath,
            handlerFileName,
            requestTypeNames,
            responseTypeNames,
          );
        }

        const requestSchema = this.generator.createSchemaDefinitionsOrDefaultFromNode(requestNode);

        const responseSchema =
          this.generator.createSchemaDefinitionsOrDefaultFromNode(responseNode);

        const ajvJson: AjvJson = {
          requestSchema,
          responseSchema,
        };
        const ajvJsonString = JSON.stringify(ajvJson, null, 2);
        const ajvJsonPath = createAJVJsonPath(handlerFolderPath);

        await FS.writeFile(ajvJsonPath, ajvJsonString);

        return new AjvGenerationHandlerRightResult(
          handlerPath,
          handlerFileName,
          requestTypeNames,
          responseTypeNames,
          ajvJson,
        );
      }),
    );
  }
}
