import dotenv from 'dotenv'
import "reflect-metadata"
import { ParliamentGroup } from '../models/parliamentGroup'
import { Deputee } from '../models/deputee'
import AppDataSource from '../data/appDataSource'
import { Repository } from 'typeorm'
import { Initiative } from '../models/initiative'
import { InitiativeEvent } from '../models/initiativeEvent'

const baseInfoFileUrl = "https://app.parlamento.pt/webutils/docs/doc.txt?path=jVZ4y7bbSU9PqO%2bm%2b8fNSBAhYxL2VhBgnxFPNTtU%2fuXfzUZ6mDl0UDZ2mncN9bn3cS6kw12HWzY4oxYnmwfDK2d%2f48815k%2fWWSigAiZUJFQg%2brcwOxbsZONWxKVvA0A%2fVD8m6ItfWIEmFfrPnqEayfHFEEULgFi%2fZD4iL%2fSC07j1fmkeHWIR4PQX7%2fJooiscVeQxAwibS%2fl39xyDpwg9H8RjHr84rxAw2Zkn8UlZX3WMsV81Mnkva2lF3wG5shv75olGq4TjSukJFncSGnzmOrcA2gl1jHVCfR%2fjvBqNe9fE6vMnuCcqiwj9FzGCw1Jq861kqem2zYB7tIRNwNtSLO4CV6jzwHyj3KcPAO80c5jCO5dlqgMZYLVMtATgwlsNwDSvEU6LDmAnlVpDDBemtw%3d%3d&fich=InformacaoBaseXVI_json.txt&Inline=true"
const initiativesFileUrl = "https://app.parlamento.pt/webutils/docs/doc.txt?path=g2Builcz%2b3tODcigVmsR6BwyZqotrxf56gbQvjnG%2fq75xu9faoj0yAAyUUcVO9CwcAJ90PfzitH5Qh7iEkYcjVx3O5UWJQU5QpDNW1n7rHgiYP2TU3sbziWfjASWsIWkJIC854lXagYfjER5Tlj8zUtrrFefk2SFK%2fvFCjQHPuHroYNipl%2fP2O6GwcSws%2bbeFsbeG6LiZNlJDHZevgj4%2fKBROXX08Lwl0OtPPlPd3tMv7D8c8jNxwtgK8R160j08%2fLF1hRmm%2f0KoayeMNEODvUFMOgBnpKqyfrpsX7YWviTbjOwJzEL8yajE%2bAUnrRJdoOLI7gKDPAXXkq90Sh97iKPplVHDt3wBKTlx3vL9nQk%3d&fich=IniciativasXVI_json.txt&Inline=true"

dotenv.config()

let parliamentGroupRepository: Repository<ParliamentGroup>
let deputeeRepository: Repository<Deputee>
let initiativeRepository: Repository<Initiative>
let eventRepository: Repository<InitiativeEvent>

async function fetchFile(url: string): Promise<string> {
    const response = await fetch(url)
    return await response.text()
}

async function crawlBaseInfo() {
    console.log("Fetching base info file")
    var result = await fetchFile(baseInfoFileUrl)
    console.log("Fetched base info file")

    var parsedObject = JSON.parse(result)

    var parsedParlamentGroups = parsedObject.Legislatura.GruposParlamentares["pt_gov_ar_objectos_GPOut"]
    var parsedDeputees = parsedObject.Legislatura.Deputados["pt_ar_wsgode_objectos_DadosDeputadoSearch"]

    var mappedDeputees = parsedDeputees.map((element: any) => {
        return {
            id: element.depId,
            name: element.depNomeCompleto,
            parliamentGroupAcronym: element.depGP["pt_ar_wsgode_objectos_DadosSituacaoGP"].gpSigla
        }
    })

    var parliamentGroups: ParliamentGroup[] = parsedParlamentGroups.map((element: {sigla: string, nome: string}) =>
         new ParliamentGroup(element.sigla, element.nome))

    console.log(`Inserting ${parliamentGroups.length} parliament groups`)

    await parliamentGroupRepository.save(parliamentGroups)

    console.log(`Inserted ${parliamentGroups.length} parliament groups`)

    let deputeesToInsert: Deputee[] = []

    for(let parlamentGroup of parliamentGroups) {
        deputeesToInsert = deputeesToInsert.concat(mappedDeputees
            .filter((dep: any) => dep.parliamentGroupAcronym === parlamentGroup.acronym)
            .map((dep: any) => new Deputee(dep.id, dep.name, parlamentGroup)))
    }

    console.log(`Inserting ${deputeesToInsert.length} deputees`)

    deputeeRepository.save(deputeesToInsert)

    console.log(`Inserted ${deputeesToInsert.length} deputees`)
}

async function crawlInitiatives() {
    console.log("Fetching initiatives file")
    var result = await fetchFile(initiativesFileUrl)
    console.log("Fetched initiatives file")
    
    var parsedObject = JSON.parse(result)

    let jsonInitiatives = parsedObject['ArrayOfPt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut']['pt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut']

    let mappedInitiatives: Initiative[] = []
    let mappedEvents: InitiativeEvent[] = []

    for(var i=0; i <jsonInitiatives.length; i++) {
        let initiativeDto: {iniId: string, dataInicioleg: string, iniTitulo: string, iniEventos: any} = jsonInitiatives[i]

        let initiative = new Initiative(initiativeDto.iniId, initiativeDto.dataInicioleg, initiativeDto.iniTitulo)
        mappedInitiatives.push(initiative)

        if(!initiativeDto.iniEventos) continue

        let eventsList = initiativeDto.iniEventos['pt_gov_ar_objectos_iniciativas_EventosOut']

        for(var j=0; j < eventsList.length; j++) {
            
            let iniEvent: {oevId: string, dataFase: string, fase: string} = eventsList[j]

            mappedEvents.push(new InitiativeEvent(iniEvent.oevId, iniEvent.dataFase, iniEvent.fase, initiative))
        }
    }

    console.log(`Inserting ${mappedInitiatives.length} initiatives`)

    await initiativeRepository.save(mappedInitiatives)
    
    console.log(`Inserted ${mappedInitiatives.length} initiatives`)

    console.log(`Inserting ${mappedEvents.length} events`)

    await eventRepository.save(mappedEvents)

    console.log(`Inserting ${mappedEvents.length} events`)
}

(async function() {

    await AppDataSource.initialize()

    parliamentGroupRepository = AppDataSource.getRepository(ParliamentGroup)
    deputeeRepository = AppDataSource.getRepository(Deputee)
    initiativeRepository = AppDataSource.getRepository(Initiative)
    eventRepository = AppDataSource.getRepository(InitiativeEvent)

    console.log("Clearing database")
    await deputeeRepository.clear()
    await parliamentGroupRepository.clear()
    console.log("Cleared database")


    await crawlBaseInfo()
    await crawlInitiatives()

})()


