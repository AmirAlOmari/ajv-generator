/* eslint-disable no-console */
import Chalk from 'chalk';

export class Logger {
  public log(...args: unknown[]): void {
    console.log(...args);
  }

  public success(...args: unknown[]): void {
    this.log(...args.map((arg) => Chalk.green(arg)));
  }

  public warn(...args: unknown[]): void {
    console.warn(...args.map((arg) => Chalk.yellow(arg)));
  }

  public error(...args: unknown[]): void {
    console.error(...args.map((arg) => Chalk.red(arg)));
  }

  public verbose(...args: unknown[]): void {
    this.log(...args);
  }

  public debug(...args: unknown[]): void {
    this.log(...args.map((arg) => Chalk.grey(arg)));
  }
}
