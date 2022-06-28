import type { Schema } from 'ts-json-schema-generator';

export type AjvJson = {
  requestSchema: Schema;
  responseSchema: Schema;
};
