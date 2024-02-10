const { AsyncDatabase } = require("promised-sqlite3");

export default async function connect(){
    const db = await AsyncDatabase.open("../DataExtractor/parliament.db");

    const query = "SELECT * FROM ParliamentGroups";

    const result = await db.all(query);
    let parliamentGroups: any = [];

    result.forEach((row: { acronym: any; name: any; }) => {
        parliamentGroups.push({
            acronym: row.acronym,
            name: row.name
        })
    });

    return parliamentGroups;
}