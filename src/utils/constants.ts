const NODEMONRUNNER: boolean = process.env.NODEMONRUNNER === "true";
export const ISDEV: boolean = require.main === module || NODEMONRUNNER;
export const VERSION: string = "1.0.2";