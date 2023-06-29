import express from "express";
const routerTests = express.Router();
import { getConnection } from "../../database/mongo";

//get all tests
routerTests.get("/", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
});

//get tests of specific user
routerTests.get("/:userid", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");

  //should test this
  const userid = req.params.userid;
});

//get test by Id
routerTests.get("/:testid", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
});

//create test
routerTests.post("/", (req, res) => {
  const dbConn = getConnection();
  const dbTests = dbConn.collection("tests");
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
