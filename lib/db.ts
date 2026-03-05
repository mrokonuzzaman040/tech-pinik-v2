import { MongoClient, Db } from "mongodb";

const _uri = process.env.MONGODB_URI;
if (!_uri) {
  throw new Error("MONGODB_URI is not set");
}
const uri: string = _uri;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

function getClient(): MongoClient {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri);
    }
    return global._mongoClient;
  }
  return new MongoClient(uri);
}

const client = getClient();
const dbName =
  typeof uri === "string" && uri.startsWith("mongodb")
    ? new URL(uri).pathname.slice(1) || "tech-pinik"
    : "tech-pinik";

export const mongoClient = client;
export const db = client.db(dbName);

export async function getDb(): Promise<Db> {
  return db;
}
