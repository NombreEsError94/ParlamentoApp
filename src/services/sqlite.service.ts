import "reflect-metadata"
import { DataSource } from "typeorm"
import { ParliamentGroup } from "../models/ParliamentGroup"
import { Deputee } from "../models/Deputee"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db.sqlite",
    entities: [ParliamentGroup, Deputee]
})

AppDataSource.initialize()
    .then(() => {

    })
    .catch((error) => console.log(error))