import { ChildProcess, execFile } from "child_process";
import logger from "../utils/logger.js";

export type FileExtension = "cpp" | "c";
export type compilerName = "g++" | "gcc";

const runWithGpp: (
  filepath: string,
  extension: FileExtension,
  controller: AbortController,
  saveTemps: boolean
) => void = (
  filepath: string,
  extension: string,
  controller: AbortController,
  saveTemps: boolean
): void => {
  const compileOptions: string[] = [
    "-Wall",
    `${filepath}.${extension}`,
    `-o`,
    filepath,
  ];

  let compilerName: compilerName = "g++";

  if (extension === "cpp") {
    compileOptions.push(`--std=c++20`);
    compilerName = "g++";
  } else if (extension === "c") {
    compileOptions.push(`--std=c17`);
    compilerName = "gcc";
  }
  if (saveTemps) {
    compileOptions.push(`-save-temps`);
  }

  const compiler: ChildProcess = execFile(compilerName, compileOptions);
  compiler.on("spawn", (): void => {
    logger.info(`compiling ${filepath}.${extension}`);
  });
  compiler.on("exit", (exitCode: number): void => {
    if (exitCode) {
      logger.error(`exited with code: ${exitCode}`);
      return;
    }
    logger.info(`exited with code: ${exitCode}`);
    const program: ChildProcess = execFile(filepath);
    const onAbort: () => void = (): void => {
      program.kill();
    };
    controller.signal.addEventListener("abort", onAbort);

    program.on("error", (err: Error): void => {
      logger.error(`${err}`);
    });
    program.on("spawn", (): void => {
      console.log();
    });
    program.stdout!.on("warn", (warning: any): void => {
      logger.warn(`${warning}`);
    });
    program.stdout!.on("data", (data: Object): void => {
      console.log(`${data}`);
    });
    program.stderr!.on("data", (err: string): void => {
      logger.error(`${err}`);
    });
    program.on("exit", (err: string): void => {
      controller.abort();
    });
    process.stdin.on("data", (data: Buffer): void => {
      if (program.stdin) {
        program.stdin.write(data);
      } else {
        logger.error(`Child does not has stdin`);
      }
    });
  });
  compiler.stdout!.on("data", (data: string): void => {
    console.log(`${data}`);
  });
  compiler.stderr!.on("data", (err: string): void => {
    logger.error(`runner error: ${err}`);
  });
};

export default runWithGpp;
