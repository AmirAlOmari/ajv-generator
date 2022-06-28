import type ts from 'typescript';
import type { Schema, SchemaGenerator } from '@amir.best/ts-json-schema-generator';

export interface CustomSchemaGeneratorInterface extends SchemaGenerator {
  buildNameToNodeMap(sourceFile: ts.SourceFile): Map<string, ts.Node>;
  createSchemaDefinitionsFromNode(node: ts.Node): Schema | null;
  createSchemaDefinitionsOrDefaultFromNode(node: ts.Node): Schema;
}
