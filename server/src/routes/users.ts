import express from "express";
const routerUsers = express.Router();
import { getConnection, makeId } from "../../database/mongo";

//get all users
routerUsers.get("/", async (req, res) => {
  try {
    const dbConn = getConnection();
    const dbTests = dbConn.collection("users");

    const cursor = dbTests.find({});
    const allUsers = [];
    for await (const doc of cursor) {
      console.log(doc);
      allUsers.push(doc);
    }

    res.send(allUsers);
  } catch {
    res.status(500).send("Server error, try again!");
  }
});

routerUsers.get("/:id", async (req, res) => {
  try {
    const dbConn = getConnection();
    const dbTests = dbConn.collection("users");

    const query = { _id: makeId(req.params.id) };
    const user = await dbTests.findOne(query);
    res.send(user);
  } catch {
    res.status(500).send("Server error, try again!");
  }
});

routerUsers.delete("/:id", async (req, res) => {
  try {
    const dbConn = getConnection();
    const dbTests = dbConn.collection("users");

    const query = { _id: makeId(req.params.id) };
    const result = await dbTests.deleteOne(query);
    if (result.deletedCount !== 1) {
      console.log("No documents matched the query. Deleted 0 documents.");
      res
        .status(400)
        .send("No documents matched the query. Deleted 0 documents.");
      return;
    }
    res.send("Successfully deleted one document.");
  } catch {
    res.status(500).send("Server error, try again!");
  }
});
export default routerUsers;
