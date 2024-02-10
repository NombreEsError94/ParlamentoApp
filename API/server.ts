import express, { Express, Request, Response} from "express";
import dotenv from "dotenv";
import SqliteConnector from "./Database/sqliteConnector";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const dbConnector = new SqliteConnector(process.env.DBPATH || '');

app.get("/test", (req: Request, res: Response) => {
    res.send("Hello test");
});

app.get("/parliamentGroups", async (req, res) => {
    const parliamentGroups = await dbConnector.getParliamentGroups();
    res.status(200).json(parliamentGroups);
});

app.get("/parliamentGroups/:acronym", async (req, res) => {
    const acronym = req.params.acronym;
    const parliamentGroup = await dbConnector.getParliamentGroupByAcronym(acronym);
    res.status(200).json(parliamentGroup);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });