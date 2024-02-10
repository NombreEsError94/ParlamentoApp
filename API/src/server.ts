import express, { Express, Request, Response} from "express";
import dotenv from "dotenv";
import SqliteConnector from "./database/sqliteConnector";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const dbConnector = new SqliteConnector(process.env.DBPATH || '');

app.get("/parliamentGroups", async (req, res) => {
    const parliamentGroups = await dbConnector.getParliamentGroups();

    res.status(200).json(parliamentGroups);
});

app.get("/parliamentGroups/:acronym", async (req, res) => {
    const acronym = req.params.acronym;
    const parliamentGroup = await dbConnector.getParliamentGroupByAcronym(acronym);

    res.status(200).json(parliamentGroup);
});

app.get("/initiatives", async (req, res) => {
    const initiatives = await dbConnector.getInitiatives();

    res.status(200).json(initiatives);
});

app.get("/initiatives/:id", async (req, res) => {
    const id: number = +req.params.id;
    const initiatives = await dbConnector.getInitiativeById(id);

    res.status(200).json(initiatives);
});

app.get("/initiatives/:id/votes", async (req, res) => {
    const id: number = +req.params.id;
    const votes = await dbConnector.getVotesByInitiativeId(id);

    res.status(200).json(votes);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });