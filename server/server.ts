require("dotenv").config({ path: "./.env" });
import express from "express";
import { connectToServer } from "./database/mongo";

const cors = require("cors");

const corsOptions = {
  origin: "0",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", routerConf);

connectToServer((err: any) => {
  if (err) {
    console.error("Error conecting to database: " + err);
    process.exit();
  }
});

app.listen(3000, () => {
  console.log("Server is listening on: 3000");
});
