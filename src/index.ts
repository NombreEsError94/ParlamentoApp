import express, { Request, Response} from 'express'
import dotenv from 'dotenv'
import "reflect-metadata"
import { AppDataSource } from './services/sqlite.service'
import { ParliamentGroup } from './models/ParliamentGroup'
import { Deputee } from './models/Deputee'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000;


(async function() {

    await AppDataSource.initialize()

    const parliamentGroup = new ParliamentGroup("Test Acronym", "Test name")

    const parliamentGroupRepository = AppDataSource.getRepository(ParliamentGroup)

    await parliamentGroupRepository.save(parliamentGroup)
    
    const deputee1 = new Deputee("1", "Name 1", parliamentGroup)
    const deputee2 = new Deputee("2", "Name 2", parliamentGroup)
    const deputee3 = new Deputee("3", "Name 3", parliamentGroup)

    const deputeeRepository = AppDataSource.getRepository(Deputee)

    deputeeRepository.save([deputee1, deputee2, deputee3])
}
)()

app.get('/', (req: Request, res: Response) => {
    res.send("Hello")
})

app.get('/parliamentGroups', async (req: Request, res: Response) => {
    /*const parliamentGroups = await getParliamentGroups()
    res.send(parliamentGroups
        .map(pg => {
            return {
                name: pg.name,
                acronym: pg.acronym
            }
            
        })
    )*/
})

app.get('/parliamentGroups/:id', async (req: Request<{id: string}>, res: Response) => {

    /*const { id } = req.params

    const parliamentGroup = await getParliamentGroupById(id)

    res.send({
        name: parliamentGroup.name,
        acronym: parliamentGroup.acronym
    })*/
})

app.get('/parliamentGroups/:id/deputees', async (req: Request<{id: string}>, res: Response) => {

    /*const { id } = req.params

    const deputees = await getDeputeesByParliamentGroupId(id)

    res.send(deputees)*/
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})