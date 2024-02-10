const { AsyncDatabase } = require("promised-sqlite3");
import dbConnector from '../Interfaces/dbConnector.js';

export default class SqliteConnector implements dbConnector{

    dbPath:string;
    db:any;

    constructor(dbPath: string){
        this.dbPath = dbPath;
    }

    async connect(){
        if(!this.db)
            this.db = await AsyncDatabase.open(this.dbPath);  
    }

    async getParliamentGroups(){
        const query = "SELECT * FROM ParliamentGroups";

        const result = await this.db.all(query);

        let parliamentGroups: any = [];

        result.forEach((row: { acronym: any; name: any; }) => {
            parliamentGroups.push({
                acronym: row.acronym,
                name: row.name
            })
        });

        return parliamentGroups;

    }
}