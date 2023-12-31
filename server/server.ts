require("dotenv").config({ path: "./.env" });
import express from "express";
const session = require("express-session");
const cookieParser = require("cookie-parser");
import { connectToServer } from "./database/mongo";
import routerConf from "./src/routerConf";

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
  // "Access-Control-Allow-Credentials": true,
  credentials: true,
};

const app = express();
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767 haha for js",
    saveUninitialized: true,
    cookie: { maxAge: oneDay, httpOnly: false },
    resave: false,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routerConf);

connectToServer((err: any) => {
  if (err) {
    console.error("Error conecting to database: " + err);
    process.exit();
  }
});

app.listen(3000, () => {
  console.log("Server is listening on: 3000");
});
