import express from "express";
// const session = require("express-session");
const bcrypt = require("bcryptjs");
const routerAuth = express.Router();
import { getConnection, makeId } from "../../database/mongo";
import { replace_id } from "./utils";

//get all users
routerAuth.post("/login", async (req, res) => {
  const credentials = req.body;
  if (!credentials.email) {
    res.status(400).send("User needs a email!");
    return;
  } else if (!credentials.password) {
    res.status(400).send("User needs a password");
    return;
  }

  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");

  const user = await dbTests.findOne({ email: credentials.email });
  if (!user) {
    res.status(401).send(`Username or password is incorrect`);
    return;
  }

  const passIsValid = await bcrypt.compare(credentials.password, user.password);

  if (!passIsValid) {
    res.status(401).send(`Username or password is incorrect`);
    return;
  }

  (req.session as any).username = user.username;
  (req.session as any).userid = user._id;
  res.cookie("user", "yes", { httpOnly: false });

  console.log(req.session);
  delete user.password;
  //res.json({ auth: true, user });
  res.send(user);
});

routerAuth.post("/register", async (req, res) => {
  const user = req.body;
  if (!user.email) {
    res.status(401).send("User needs a valid email!");
    return;
  } else if (!user.username) {
    res.status(401).send("User needs a username");
    return;
  } else if (!user.firstname) {
    res.status(401).send("User needs a firstname");
    return;
  } else if (!user.lastname) {
    res.status(401).send("User needs a lastname");
    return;
  } else if (!user.password) {
    res.status(401).send("User needs a password");
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = await bcrypt.hash(user.password, salt);

  const dbConn = getConnection();
  const dbTests = dbConn.collection("users");

  await Promise.resolve(dbTests.insertOne(user))
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error inserting document");
    });
  res.send(user);
});

routerAuth.post("/logout", (req, res) => {
  res.clearCookie("user");

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send(false);
    } else {
      console.log(req.session);
      // res.redirect("/login");
      res.send(true);
    }
  });
  //   res.redirect("/");
});

export default routerAuth;
