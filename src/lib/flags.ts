import { join } from "path";
import { VERSION } from "../utils/constants.js";

export const help: () => void = (): void => {
  const builtIndexFile: string = join(__dirname, "../", "dist", "index.js");
  console.log(`Usage: node ${builtIndexFile} <filename>
      optional arguments:
        -st    : save temp files
        -h     : help
        -v     : version
        --file : path to c/cpp file`);
  process.exit(0);
};

export const version: () => void = (): void => {
  console.log(`v${VERSION}`);
  process.exit(0);
};
