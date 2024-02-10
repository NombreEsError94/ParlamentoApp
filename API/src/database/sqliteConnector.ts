const { AsyncDatabase } = require("promised-sqlite3");
import { Init } from 'v8';
import dbConnector from '../interfaces/dbConnector.js';
import Initiative from '../models/initiative.js';
import ParliamentGroup from '../models/parliamentGroup.js';
import ParliamentGroupVote from '../models/parliamentGroupVote.js';
import Vote from '../models/vote.js';

export default class SqliteConnector implements dbConnector{

    dbPath:string;
    db:any;

    constructor(dbPath: string){
        this.dbPath = dbPath;
    }
    async getInitiatives(): Promise<Initiative[]> {
        await this.connect();
        const query = "SELECT * FROM Initiatives";

        const result = <Initiative[]>await this.db.all(query);

        await this.close();

        return result;
    }

    async getInitiativeById(id: number): Promise<Initiative> {
        await this.connect();
        const query = `SELECT * FROM Initiatives WHERE id = '${id}'`;

        const result = <Initiative>await this.db.get(query);

        await this.close();

        return result;
    }
    
    async getVotesByInitiativeId(initiativeId: number): Promise<Vote> {
        await this.connect();

        const query = `SELECT * FROM Votes WHERE initiativeId = '${initiativeId}'`;

        const result = <Vote>await this.db.get(query);

        const parliamentGroupVotes = await this.db.all(`
            SELECT * FROM ParliamentGroupsVotes WHERE VoteId = '${result.id}'
        `);

        result.parliamentGroupVotes = parliamentGroupVotes;

        await this.close();

        return result;
    }

    async getParliamentGroups(): Promise<ParliamentGroup[]> {
        await this.connect();
        const query = "SELECT * FROM ParliamentGroups";

        const result = <ParliamentGroup[]>await this.db.all(query);

        await this.close();

        return result;
    }

    async getParliamentGroupByAcronym(acronym: string): Promise<ParliamentGroup> {
        await this.connect();

        const query = `SELECT * FROM ParliamentGroups WHERE acronym ='${acronym}'`;
        const result = <ParliamentGroup>await this.db.get(query);

        await this.close();

        return result;
    }

    async connect(){
        this.db = await AsyncDatabase.open(this.dbPath);  
    }

    async close(){
        await this.db.close();
    }
}