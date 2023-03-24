import { Logger, pino } from "pino";
import { ISDEV } from "../index";

const logger: Logger = pino({
  transport: ISDEV
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});

export default logger;
