import { config } from "dotenv";

config();
export const NODEMONRUNNER: boolean = process.env.NODEMONRUNNER === "true";
export const VERSION: string = "1.0.3";
