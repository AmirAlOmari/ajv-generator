import type ts from 'typescript';
import { Schema, SchemaGenerator } from '@amir.best/ts-json-schema-generator';

import type { CustomSchemaGeneratorInterface } from './custom-schema-generator.interface';
import { DEFAULT_JSON_SCHEMA } from './constants';

export class CustomSchemaGenerator
  extends SchemaGenerator
  implements CustomSchemaGeneratorInterface
{
  public buildNameToNodeMap(sourceFile: ts.SourceFile): Map<string, ts.Node> {
    const nameToNodeMap = new Map<string, ts.Node>();
    const typeChecker = this.program.getTypeChecker();
    this.inspectNode(sourceFile, typeChecker, nameToNodeMap);

    return nameToNodeMap;
  }

  public createSchemaDefinitionsFromNode(node: ts.Node): Schema | null {
    return this.createSchemaFromNodes([node]);
  }

  public createSchemaDefinitionsOrDefaultFromNode(node: ts.Node): Schema {
    const schemaDefinitions = this.createSchemaDefinitionsFromNode(node);

    return schemaDefinitions || DEFAULT_JSON_SCHEMA;
  }
}
