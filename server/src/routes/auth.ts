import express from "express";
const routerAuth = express.Router();
import { getConnection, makeId } from "../../database/mongo";

//get all users
routerAuth.post("/login", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");
});

routerAuth.post("/register", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");
});

routerAuth.get("/logout", (req, res) => {
  // req.session.destroy();
  //   res.redirect("/");
});

export default routerAuth;
