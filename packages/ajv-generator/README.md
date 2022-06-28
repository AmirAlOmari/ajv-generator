# AJV-generator

## Requirements

- **TypeScript** Cubyn service
- `@devcubyn/carotte-runtime@^6.0.0`

## Installation

```bash
yarn add @devcubyn/ajv-generator
```

## Description

The `ajv-generator` is a library that generates a JSON schemas for both request and response in Cubyn TypeScript services. The generated AJVs are the `ajv.json` files, generated in the build phase, considered as a build artifacts and put into `dist/{controllers,lambdas,listeners}/*/ajv.json`

## Usage

To make a use of it, go through the following steps:

- Feel free to remove `requestSchema` & `responseSchema` properties from every `meta.ts` file, as those will anyway be overwritten later
- Ensure that **ALL** handlers (controllers, lambdas, listeners) have an expected **EXPORTED** types, e.g. `lambdas/box.identify:v1/handler.ts` is expected to contain the following code:

```typescript
// `lambdas/box.identify:v1/handler.ts`

import { Handler } from '@devcubyn/carotte-runtime';

import type { Box } from '@inbound/domain/box';

/**
 * Or simply `export type Request = ...`
 */
export type BoxIdentifyRequest = {
  id: string;
};

/**
 * Or simply `export type Response = ...`
 */
export type BoxIdentifyResponse = {
  box: Box;
};

export const handler: Handler<BoxIdentifyRequest, BoxIdentifyResponse> = async () => {
  // ...
};
```

- Make sure to generate-ajv after each `tsc` run. To do so, add the `postbuild` in your `package.json`

```json
// `package.json`

{
  // ...
  "scripts": {
    "postbuild": "yarn generate-ajv"
  }
  // ...
}
```

- Install the `carotte-runtime@^6.0.0`

```bash
yarn add @devcubyn/carotte-runtime@^6.0.0
```

- Use the `AjvJsonLoaderPlugin`. To do so, update the `src/index.ts` (or the other file that does `await runtime.start()` for you) in the following way:

```typescript
// `src/index.ts`

import { AjvJsonLoaderPlugin } from '@devcubyn/carotte-runtime';

// ...

{
  // ...
  await runtime.hooks.use(new AjvJsonLoaderPlugin());
  // ...
  await runtime.start({ domain: 'MY_SERVICE_DOMAIN' });
  // ...
}
```
