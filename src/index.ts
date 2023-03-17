import fs, { existsSync, watch, WatchEventType } from "fs";
import { isAbsolute, join } from "path";
import { argv, cwd } from "process";
import runCpp from "./lib/runcpp";
import logger from "./utils/logger";

const runScriptPath: string = join(__dirname, "lib", "run.sh");

const filename: string = argv[2];

const filepath: string = isAbsolute(filename)
  ? filename
  : join(cwd(), filename);

if (existsSync(runScriptPath)) {
  if (fs.existsSync(filepath)) {
    logger.info(`watching path ${filepath}.cpp for changes`);
    let controller: AbortController = new AbortController();

    runCpp(filepath, controller);
    const triggerRestart: () => void = (): void => {
      if (controller.signal.aborted) {
        controller.abort();
        controller = new AbortController();
        runCpp(filepath, controller);
      } else {
        controller.abort();
      }
    };
    process.stdin.on("data", (data: Buffer): void => {
      const cmd: string = data.toString();
      if (cmd === "trs\n") {
        logger.info(`triggering restart`);
        triggerRestart();
      }
    });
    watch(`${filename}.cpp`, (ev: WatchEventType): void => {
      logger.info(`file ${filename} ${ev}`);
      triggerRestart();
    });
  } else {
    logger.error(`path ${filepath} does not exists`);
  }
} else {
  logger.error(`run script not found ENOENT`);
}
