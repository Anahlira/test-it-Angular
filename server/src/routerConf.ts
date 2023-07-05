import express from "express";
const routerConf = express.Router();

import routerTests from "./routes/tests";
import routerUsers from "./routes/users";
import routerAuth from "./routes/auth";

routerConf.use("/tests", routerTests);
routerConf.use("/auth", routerAuth);
routerConf.use("/user", routerUsers);

export default routerConf;
