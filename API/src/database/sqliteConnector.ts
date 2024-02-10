const { AsyncDatabase } = require("promised-sqlite3");
import dbConnector from '../interfaces/dbConnector.js';
import ParliamentGroup from '../models/parliamentGroup.js';

export default class SqliteConnector implements dbConnector{

    dbPath:string;
    db:any;

    constructor(dbPath: string){
        this.dbPath = dbPath;
    }

    async getParliamentGroups(): Promise<ParliamentGroup[]> {
        await this.connect();
        const query = "SELECT * FROM ParliamentGroups";

        const result = await this.db.all(query);

        let parliamentGroups: ParliamentGroup[] = [];

        result.forEach((row: ParliamentGroup) => {
            parliamentGroups.push({
                acronym: row.acronym,
                name: row.name
            })
        });

        await this.close();

        return parliamentGroups;
    }

    async getParliamentGroupByAcronym(acronym: string): Promise<ParliamentGroup> {
        await this.connect();

        const query = `SELECT * FROM ParliamentGroups WHERE acronym ='${acronym}'`;
        const result = await this.db.get(query);

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