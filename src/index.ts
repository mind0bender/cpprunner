#! /usr/bin/env node
import { existsSync, watch, WatchEventType } from "fs";
import { isAbsolute, join } from "path";
import { cwd, exit } from "process";
import { help, version } from "./lib/flags.js";
import runWithGpp, { FileExtension } from "./lib/run.js";
import logger from "./utils/logger.js";
import { cliArgv } from "./utils/cliparser.js";
import { NODEMONRUNNER } from "./utils/constants.js";
const ISDEV: boolean = require.main === module || NODEMONRUNNER;

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
  if (cliArgv.help) {
    help();
  }
  if (cliArgv.version) {
    version();
  }

  const filenameWExtension: string = cliArgv.file || cliArgv._[2];
  if (!filenameWExtension) {
    console.error(`file is required
    use \`cpprunner -h\` for more information`);
    exit(0);
  }
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
    exit(1);
  }

  const saveTemps: boolean = cliArgv.showtemp;

  const filepath: string = isAbsolute(filename)
    ? filename
    : join(cwd(), filename);

  if (existsSync(`${filepath}.${extension}`)) {
    run(filepath, extension, saveTemps);
  } else {
    logger.error(`path ${filepath} does not exists`);
    exit(1);
  }
};

if (ISDEV) {
  main();
}

export default run;
