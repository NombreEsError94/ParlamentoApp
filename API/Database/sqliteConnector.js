const sqlite3 = require('sqlite3').verbose();

function connect(){
    var db = new sqlite3.Database('../DataExtractor/parliament.db', (err) => {
        if(err){
            return console.error(err.message);
        }
    
        console.log("Successfully connected to database");
    });

    let query = "SELECT * FROM ParliamentGroups";
    let result = [];

    db.all(query, [], (err, rows) => {
        if(err){
            throw err;
        }

        rows.forEach((row) => {
            result.push({
                acronym: row.acronym,
                name: row.name
            })
        })

        console.log(result);
    })
}


exports.connect = connect
