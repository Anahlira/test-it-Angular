import express from "express";
const routerUsers = express.Router();
import { getConnection, makeId } from "../../database/mongo";

//get all users
routerUsers.get("/", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");
});

routerUsers.get("/:id", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");
});

routerUsers.delete("/:id", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");
});
export default routerUsers;
