import express, { Express, Request, Response} from "express";
import dotenv from "dotenv";
import connect from './Database/sqliteConnector';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/test', (req: Request, res: Response) => {
    res.send("Hello test");
});

app.get('/parliamentGroups', async (req, res) => {
    const parliamentGroups = await connect();
    res.status(200).json(parliamentGroups);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });