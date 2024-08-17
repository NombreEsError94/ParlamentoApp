import express, { Request, Response} from 'express'
import { getDeputeesByParliamentGroupId, getParliamentGroupById, getParliamentGroups } from './services/parliamentGroup.service'
import { connectToDatabase } from './services/database.service'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000;

(async function() {
    await connectToDatabase()
}
)()

app.get('/', (req: Request, res: Response) => {
    res.send("Hello")
})

app.get('/parliamentGroups', async (req: Request, res: Response) => {
    const parliamentGroups = await getParliamentGroups()
    res.send(parliamentGroups
        .map(pg => {
            return {
                name: pg.name,
                acronym: pg.acronym
            }
            
        })
    )
})

app.get('/parliamentGroups/:id', async (req: Request<{id: string}>, res: Response) => {

    const { id } = req.params

    const parliamentGroup = await getParliamentGroupById(id)

    res.send({
        name: parliamentGroup.name,
        acronym: parliamentGroup.acronym
    })
})

app.get('/parliamentGroups/:id/deputees', async (req: Request<{id: string}>, res: Response) => {

    const { id } = req.params

    const deputees = await getDeputeesByParliamentGroupId(id)

    res.send(deputees)
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})