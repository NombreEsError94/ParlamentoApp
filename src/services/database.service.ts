import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";


export const collections: { parliamentGroups?: mongoDB.Collection} = {}
export var databaseClient: mongoDB.MongoClient


export async function connectToDatabase() {

    const dbConnectionString = process.env.DB_CONN_STRING ?? ""
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbConnectionString);
            
    await client.connect();

    console.log("Successfully connected to database")

    databaseClient = client
 }