import { join } from "path";

const help: () => void = (): void => {
  const builtIndexFile: string = join(__dirname, "../", "dist", "index.js");
  console.log(`Usage: node ${builtIndexFile} <filename>
      optional arguments:
        -st : save temp files
        -h  : help`);
  process.exit(0);
};

export default help;
