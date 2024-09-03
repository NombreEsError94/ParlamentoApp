import "reflect-metadata"
import { DataSource } from "typeorm"
import { ParliamentGroup } from "../models/parliamentGroup"
import { Deputee } from "../models/deputee"
import { Initiative } from "../models/initiative"
import { Vote } from "../models/vote"
import { InitiativeEvent } from "../models/initiativeEvent"

export default new DataSource({
    type: "sqlite",
    database: "./db.sqlite",
    entities: [ParliamentGroup, Deputee, Initiative, InitiativeEvent, Vote],
    migrations: ["src/data/migrations/*.ts"],
    migrationsTableName: "database_migrations"
})