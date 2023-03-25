#! /usr/bin/env node
import { existsSync, watch, WatchEventType } from "fs";
import { isAbsolute, join } from "path";
import { argv, cwd } from "process";
import help from "./lib/help";
import runWithGpp, { FileExtension } from "./lib/run";
import { ISDEV } from "./utils/constants";
import logger from "./utils/logger";

/**
 * setting NODEMONRUNNER=true in dev script only
 * as (require.main === module) is false for nodemon
 * */


/**
 * starts watching the file for changes and recompiles and runs the program
 * @param filepath path to the program file excluding the extension
 * @param extension extension of the file
 * @param saveTemps should the temporary files be saved
 */
const run: (
  filepath: string,
  extension?: FileExtension,
  saveTemps?: boolean
) => void = (
  filepath: string,
  extension: FileExtension = "cpp",
  saveTemps: boolean = false
): void => {
  logger.info(`watching path ${filepath}.${extension} for changes`);
  logger.info(`to restart at any time, enter \`trs\``);
  let controller: AbortController = new AbortController();

  runWithGpp(filepath, extension, controller, saveTemps);
  const triggerRestart: () => void = (): void => {
    if (controller.signal.aborted) {
      controller.abort();
      controller = new AbortController();
      runWithGpp(filepath, extension, controller, saveTemps);
    } else {
      controller.abort();
    }
  };
  process.stdin.on("data", (data: Buffer): void => {
    const cmd: string = data.toString();
    // hard restart on "trs" input like rs for nodemon
    if (cmd === "trs\n") {
      logger.info(`triggering restart`);
      triggerRestart();
    }
  });
  watch(`${filepath}.${extension}`, (ev: WatchEventType): void => {
    logger.info(`file ${filepath} ${ev}`);
    triggerRestart();
  });
};

/**
 * parses the arguments passed and calls the run method
 */
const main: () => void = (): void => {
  if (argv.length < 3 || argv.includes("-h")) {
    help();
  }

  const validFlags: string[] = ["-st", "-h"];

  for (let i: number = 3; i < argv.length; i++) {
    const flag: string = argv[i];
    if (!validFlags.includes(flag)) {
      logger.error(`Invalid flag: ${flag}`);
      process.exit(1);
    }
  }

  const filenameWExtension: string = argv[2];
  let filename: string = filenameWExtension;
  let extension: FileExtension = "c";
  if (filenameWExtension.endsWith(`.cpp`)) {
    extension = "cpp";
    filename = filenameWExtension.slice(0, -4);
  } else if (filenameWExtension.endsWith(".c")) {
    extension = "c";
    filename = filenameWExtension.slice(0, -2);
  } else {
    logger.error(`please provide the filename with an extension of c/cpp.`);
    process.exit(1);
  }

  const saveTemps: boolean = argv.includes(`-st`);

  if (!filename) {
    logger.error("Please specify a filename");
    process.exit(1);
  }

  const filepath: string = isAbsolute(filename)
    ? filename
    : join(cwd(), filename);

  if (existsSync(`${filepath}.${extension}`)) {
    run(filepath, extension, saveTemps);
  } else {
    logger.error(`path ${filepath} does not exists`);
    process.exit(1);
  }
};

if (ISDEV) {
  main();
}

export default run;
