import express from "express";
const routerTests = express.Router();

import { QuestionsI, TestI, isATest } from "../../interfaces/Interfaces";
import { getConnection, makeId } from "../../database/mongo";

//get all tests
//returns tests with _id, title and visibility
routerTests.get("/", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
  // dbTests.find({}).toArray((err, result) => {});

  const options = {
    projection: { title: 1, visibility: 1 },
  };

  const cursor = dbTests.find({}, options);
  const allTests = [];
  for await (const doc of cursor) {
    console.log(doc);
    allTests.push(doc);
  }

  res.send(allTests);
});

//get tests of specific user
//returns tests with _id, title and visibility
routerTests.get("/user/:id", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  const query = { owner_id: Number(req.params.id) };
  const options = {
    projection: { title: 1, visibility: 1 },
  };

  const cursor = dbTests.find(query, options);
  const allTests = [];
  for await (const doc of cursor) {
    console.log(doc);
    allTests.push(doc);
  }

  res.send(allTests);
});

//get test by Id
routerTests.get("/:testid", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  const query = { _id: makeId(req.params.testid) };
  const test = await dbTests.findOne(query);
  res.send(test);
});

//create test
routerTests.post("/", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  if (!isATest(req.body) || !req.body.questions) {
    res.status(400);
    if (!req.body.title) res.send("The test is missing title");
    else if (!req.body.ownerId) res.send("The test is missing ownerId");
    else if (!req.body.visibility)
      res.send("The test is missing visibility: 'public' or 'private'");
    else if (!req.body.questions) res.send("The test is missing questions");
    else res.send("unexpexted error");

    return;
  }
  const isPublic = req.body.visibility === "private" ? 0 : 1;
  const document = {
    ownerId: req.body.ownerId,
    title: req.body.title,
    visibility: isPublic,
    questions: req.body.questions as unknown as QuestionsI,
    created: new Date(),
    last_modified: new Date(),
  };

  await Promise.resolve(dbTests.insertOne(document))
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error inserting document");
    });
  res.send(document);
});

//delete specific test
routerTests.delete("/:testid", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  const query = { _id: makeId(req.params.testid) };

  const result = await dbTests.deleteOne(query);
  if (result.deletedCount !== 1) {
    console.log("No documents matched the query. Deleted 0 documents.");
    res
      .status(400)
      .send("No documents matched the query. Deleted 0 documents.");
    return;
  }
  res.send("Successfully deleted one document.");
});

//delete all tests of user (user must be specified)
routerTests.delete("/user/:id", async (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  const query = { owner_id: Number(req.params.id) };

  const result = await dbTests.deleteMany(query);
  if (result.deletedCount === 0) {
    console.log("No documents matched the query. Deleted 0 documents.");
    res
      .status(400)
      .send(`No documents matched the query. Deleted 0 documents.`);
    return;
  }
  res.send(`Successfully deleted ${result.deletedCount} documents.`);
});

export default routerTests;
