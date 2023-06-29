import { MongoClient, Db } from "mongodb";
// const client = new MongoClient(process.env.ATLAS_MONGO as string, {
//   useNewUrlParser: true,
//   useUnigiedTopology: true,
// });

let dbConn: Db;
const dbName = "testit";

export const connectToServer = (cb: Function) => {
  MongoClient.connect(process.env.ATLAS_MONGO as string)
    .then((client) => {
      const dbConn = client.db(dbName);
      console.log("Connected to database");

      return cb();
    })
    .catch((err) => {
      return cb(err);
    });
};
export const getDb = () => dbConn;
