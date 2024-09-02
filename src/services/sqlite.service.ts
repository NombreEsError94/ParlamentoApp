import "reflect-metadata"
import { DataSource } from "typeorm"
import { ParliamentGroup } from "../models/parliamentGroup"
import { Deputee } from "../models/deputee"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db.sqlite",
    entities: [ParliamentGroup, Deputee]
})

AppDataSource.initialize()
    .then(() => {

    })
    .catch((error) => console.log(error))