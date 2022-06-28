# ⚠ WIP ⚠

// _Intermediate result_

# Problem

Currently engineers are responsible to write JSON schemas (`requestSchema`, `responseSchema`) for each **target** (controller/lambda). As long as these schemas could NOT be typechecked, they are considered as potential cause of bugs.

# Idea

The idea is to generate JSON schemas directly from the types. Initially, we were considering two options:

- JIT approach (in runtime): use TypeScript decorators, and so the Reflection API
- AoT approach (during build): use TypeScript compiler, and so the AST directly

The JIT approach is pretty much limited by Reflection API capabilities, which results in other type of non-typechecked bugs (possible inconsistency between the actual type definition and information provided to the decorator). This approach seems to simply trade one kind of bugs with another.

The AoT approach is a bit more complex, but it is able to generate typechecked schemas. This approach is also more flexible, as it allows to generate schemas for any type, allowing to support unions, type aliases, etc. those are impossible to do with the Reflection API only.

[Nest.js](https://nestjs.com/) team seem to have the same opinion, which is the reason why they introduced CLI plugins. Read more [here](https://trilon.io/blog/eliminating-redundancy-with-nestjs-cli-plugins)

# Vision

Current vision is to use the AoT approach, generate schemas for input/output types during the build time and treat them as build artifacts, as we do with the regular `tsc` output.

> (WIP) Note: the current vision it to generate `dist/{controllers/lambdas}/**/meta.json` file for each target

There are multiple solutions could be applied:

# Solutions

## Use ts-json-schema-generator

Pros:

- A bit easier to start with

Cons:

- Runs independently from yarn build (tsc), which results in multiple TS AST retrievals, which takes time
- Extracts fileNames on each SchemaGenerator#createSchema(), which results in O(n) complexity, where “n” is the amount of targets (controllers/lambdas)

## Use TypeScript transformers

Pros:

- Those will run as a part of the main compile process
- We get the direct access to the TS AST, which allows us not to only generate JSON schemas, but more if we will be interested

Cons:

- Requires a wrapper around tsc. Suggestion: introduce a carotte build command to encapsulate it
- Harder to start with
