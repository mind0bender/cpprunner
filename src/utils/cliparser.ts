import minimist, { Opts, ParsedArgs } from "minimist";
import { argv } from "process";

const cliArgsOpts: Opts = {
  boolean: ["h", "v", "st"],
  string: ["file"],
  alias: {
    file: "f",
    h: "help",
    v: "version",
    st: "showtemp",
  },
  default: {
    file: "",
    h: false,
    v: false,
    st: false,
  },
};
export const cliArgv: ParsedArgs = minimist(argv, cliArgsOpts);
