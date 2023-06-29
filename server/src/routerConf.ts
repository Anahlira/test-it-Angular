import express from "express";
const routerConf = express.Router();

import routerTests from "./routes/tests";

routerConf.use("/tests", routerTests);

export default routerConf;
