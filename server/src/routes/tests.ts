import express from "express";
const routerTests = express.Router();

import { QuestionsI, TestI, isATest } from "../../interfaces/Interfaces";
import { getConnection } from "../../database/mongo";

//get all tests
routerTests.get("/", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  res.send("tests");
});

//get tests of specific user
routerTests.get("/user", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  console.log(req.query);
  res.send("tests of user");
});

//get test by Id
routerTests.get("/:testid", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
  res.send("test");
});

//create test
routerTests.post("/", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  if (!isATest(req.body) || !req.body.questions) {
    res.status(400);
    if (!req.body.title) res.send("The test is missing title");
    else if (!req.body.owner_id) res.send("The test is missing owner_id");
    else if (!req.body.visibility)
      res.send("The test is missing visibility: 'public' or 'private'");
    else if (!req.body.questions) res.send("The test is missing questions");
    else res.send("unexpexted error");

    return;
  }
  const isPublic = req.body.visibility === "private" ? 0 : 1;
  const document = {
    owner_id: req.body.owner_id,
    title: req.body.title,
    visibility: isPublic,
    questions: req.body.questions as unknown as QuestionsI,
    created: new Date(),
    last_modified: new Date(),
  };

  Promise.resolve(dbTests.insertOne(document))
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error inserting document");
    });
  res.send("Added test to database");
});

//delete specific test
routerTests.delete("/:testid", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
});

//delete all tests of user (user must be specified)
routerTests.delete("/", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
});

export default routerTests;
