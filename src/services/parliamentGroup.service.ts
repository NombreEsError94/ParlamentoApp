import ParliamentGroup from "../models/parliamentGroup";
import Deputee from "../models/deputee";
import { databaseClient } from "./database.service";

const PARLIAMENT_GROUPS_COLLECTION_NAME = 'parliamentGroups'

export async function getParliamentGroups(): Promise<ParliamentGroup[]> {

    const allGroups = await databaseClient
        .db(process.env.DB_NAME)
        .collection<ParliamentGroup>(PARLIAMENT_GROUPS_COLLECTION_NAME)
        .find({})
        .toArray() as ParliamentGroup[]

    return allGroups
   
} 

export async function getParliamentGroupById(id: string): Promise<ParliamentGroup> {
    const matchGroup = await databaseClient
        .db(process.env.DB_NAME)
        .collection<ParliamentGroup>(PARLIAMENT_GROUPS_COLLECTION_NAME)
        .findOne({acronym: id}) as ParliamentGroup

    return matchGroup
}

export async function getDeputeesByParliamentGroupId(id: string): Promise<Deputee[]> {
    const parliamentGroup = await databaseClient
        .db(process.env.DB_NAME)
        .collection<ParliamentGroup>(PARLIAMENT_GROUPS_COLLECTION_NAME)
        .findOne({acronym: id}) as ParliamentGroup


    return parliamentGroup.deputees
}

export async function addParliamentGroup(newGroup: ParliamentGroup) {
    await databaseClient
        .db(process.env.DB_NAME)
        .collection<ParliamentGroup>(PARLIAMENT_GROUPS_COLLECTION_NAME)
        .insertOne(newGroup)
}

export async function clear() {
    await databaseClient
        .db(process.env.DB_NAME)
        .collection<ParliamentGroup>(PARLIAMENT_GROUPS_COLLECTION_NAME)
        .drop()
}