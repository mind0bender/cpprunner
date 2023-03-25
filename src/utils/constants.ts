const NODEMONRUNNER: boolean = process.env.NODEMONRUNNER === "true";
export const ISDEV: boolean = require.main === module || NODEMONRUNNER;
