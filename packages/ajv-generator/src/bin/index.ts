#!/usr/bin/env node

import { run } from '../lib/cli';

// eslint-disable-next-line jest/require-hook
run()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);

    process.exitCode = 1;
  });
