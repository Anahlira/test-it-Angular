import { MongoClient, Db, ObjectId } from "mongodb";
// const client = new MongoClient(process.env.ATLAS_MONGO as string, {
//   useNewUrlParser: true,
//   useUnigiedTopology: true,
// });

let dbConn: Db;
const dbName = "testit";

export const connectToServer = (cb: Function) => {
  MongoClient.connect(process.env.ATLAS_MONGO as string)
    .then((client) => {
      dbConn = client.db(dbName);
      console.log("Connected to database");

      return cb();
    })
    .catch((err) => {
      return cb(err);
    });
};
export const getConnection = () => dbConn;
export const makeId = (id: string) => new ObjectId(id);
