import express, { Express, Request, Response} from "express";
import dotenv from "dotenv";
import SqliteConnector from './Database/sqliteConnector';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const dbConnector = new SqliteConnector(process.env.DBPATH || '');

app.get('/test', (req: Request, res: Response) => {
    res.send("Hello test");
});

app.get('/parliamentGroups', async (req, res) => {
    await dbConnector.connect();
    const parliamentGroups = await dbConnector.getParliamentGroups();
    res.status(200).json(parliamentGroups);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });