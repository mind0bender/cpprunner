import fs, { existsSync, watch, WatchEventType } from "fs";
import { isAbsolute, join } from "path";
import { argv, cwd } from "process";
import runWithGpp from "./lib/run";
import logger from "./utils/logger";

const filename: string = argv[2];
const extension: string = argv[3] || "c";

if (!filename) {
  logger.error("Please specify a filename");
  process.exit(1);
}

const filepath: string = isAbsolute(filename)
  ? filename
  : join(cwd(), filename);

if (fs.existsSync(`${filepath}.${extension}`)) {
  logger.info(`watching path ${filepath}.${extension} for changes`);
  let controller: AbortController = new AbortController();

  runWithGpp(filepath, extension, controller);
  const triggerRestart: () => void = (): void => {
    if (controller.signal.aborted) {
      controller.abort();
      controller = new AbortController();
      runWithGpp(filepath, extension, controller);
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
  watch(`${filename}.${extension}`, (ev: WatchEventType): void => {
    logger.info(`file ${filename} ${ev}`);
    triggerRestart();
  });
} else {
  logger.error(`path ${filepath} does not exists`);
  process.exit(1);
}
