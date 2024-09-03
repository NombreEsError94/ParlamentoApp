import express, { Request, Response} from 'express'
import dotenv from 'dotenv'
import "reflect-metadata"
import AppDataSource from './data/appDataSource'
import { ParliamentGroup } from './models/parliamentGroup'
import { Deputee } from './models/deputee'
import { Repository } from 'typeorm'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000;

let parliamentGroupRepository: Repository<ParliamentGroup>
let deputeeRepository: Repository<Deputee>


(async function() {

    await AppDataSource.initialize()

    parliamentGroupRepository = AppDataSource.getRepository(ParliamentGroup)
    deputeeRepository = AppDataSource.getRepository(Deputee)
}
)()

app.get('/', (req: Request, res: Response) => {
    res.send("Hello")
})

app.get('/parliamentGroups', async (req: Request, res: Response) => {
    const parlamentGroups = await parliamentGroupRepository.find()

    res.send(parlamentGroups
        .map(pg => ({
            name: pg.name,
            acronym: pg.acronym
        }))
    )
})

app.get('/parliamentGroups/:id', async (req: Request<{id: string}>, res: Response) => {

    const { id } = req.params

    const parlamentGroup = await parliamentGroupRepository.findOneBy({acronym: id})

    res.send(parlamentGroup ? {
        name: parlamentGroup.name,
        acronym: parlamentGroup.acronym
    } : {})
})

app.get('/parliamentGroups/:id/deputees', async (req: Request<{id: string}>, res: Response) => {

    const { id } = req.params

    const deputees = await deputeeRepository.findBy({parliamentGroup: {acronym: id}})

    res.send(deputees)
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})