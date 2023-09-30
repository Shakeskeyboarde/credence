#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import chalk from 'chalk';
import dotenv from 'dotenv';
import { execa } from 'execa';

process.on('unhandledRejection', (err) => {
  throw err;
});
process.on('uncaughtException', (err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(process.exitCode || 1);
});

const [command = process.env.SHELL || 'bash', ...args] = process.argv.slice(2);
const envFile = `.creds-${command}`;

const loadCreds = async (dir = process.cwd()): Promise<void> => {
  await readFile(resolve(dir, envFile))
    .then(dotenv.parse)
    .then((values) => {
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          process.env[key] = value.toString();
        } else if (typeof value === 'boolean') {
          process.env[key] = value ? 'true' : '';
        }
      });
    })
    .catch(() => {
      const parent = dirname(dir);

      if (parent !== dir) {
        return loadCreds(parent);
      }

      console.error(chalk.yellow('No credentials environment file found.'));
    });
};

await loadCreds();
await execa(command, args, { stdio: 'inherit' }).catch((error) => {
  process.exitCode ||= error.exitCode || 1;
});
