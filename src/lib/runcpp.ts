import { ChildProcess, execFile } from "child_process";
import logger from "../utils/logger";

const getExecExtension: () => string = (): string => {
  const extensions = {
    win32: ".exe",
    linux: "",
  };
  const { platform } = process;
  if (platform === "win32" || platform === "linux") {
    return extensions[platform];
  }
  return "";
};

const runCpp: (cppFilepath: string, controller: AbortController) => void = (
  cppFilepath: string,
  controller: AbortController
): void => {
  const compiler: ChildProcess = execFile(`g++`, [
    `--std=c++20`,
    `${cppFilepath}.cpp`,
    `-o`,
    cppFilepath,
  ]);
  compiler.on("spawn", (): void => {
    logger.info(`compiling ${cppFilepath}.cpp`);
  });
  compiler.on("exit", (exitCode: number): void => {
    if (exitCode) {
      logger.error(`exited with code: ${exitCode}`);
      return;
    }
    logger.info(`exited with code: ${exitCode}`);
    const cppProgram: ChildProcess = execFile(cppFilepath);
    const onAbort: () => void = (): void => {
      cppProgram.kill();
    };
    controller.signal.addEventListener("abort", onAbort);

    cppProgram.on("error", (err: Error): void => {
      logger.error(`${err}`);
    });
    cppProgram.on("spawn", (): void => {
      console.log();
    });
    cppProgram.stdout!.on("warn", (warning: any): void => {
      logger.warn(`${warning}`);
    });
    cppProgram.stdout!.on("data", (data: Object): void => {
      console.log(`${data}`);
    });
    cppProgram.stderr!.on("data", (err: string): void => {
      logger.error(`${err}`);
    });
    cppProgram.on("exit", (err: string): void => {
      controller.abort();
    });
    process.stdin.on("data", (data: Buffer): void => {
      if (cppProgram.stdin) {
        cppProgram.stdin.write(data);
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

export default runCpp;
