import dotenv from 'dotenv'
import "reflect-metadata"
import { ParliamentGroup } from '../models/parliamentGroup'
import { Deputee } from '../models/deputee'
import { AppDataSource } from '../services/sqlite.service'
import { Repository } from 'typeorm'

const baseInfoFileUrl = "https://app.parlamento.pt/webutils/docs/doc.txt?path=jVZ4y7bbSU9PqO%2bm%2b8fNSBAhYxL2VhBgnxFPNTtU%2fuXfzUZ6mDl0UDZ2mncN9bn3cS6kw12HWzY4oxYnmwfDK2d%2f48815k%2fWWSigAiZUJFQg%2brcwOxbsZONWxKVvA0A%2fVD8m6ItfWIEmFfrPnqEayfHFEEULgFi%2fZD4iL%2fSC07j1fmkeHWIR4PQX7%2fJooiscVeQxAwibS%2fl39xyDpwg9H8RjHr84rxAw2Zkn8UlZX3WMsV81Mnkva2lF3wG5shv75olGq4TjSukJFncSGnzmOrcA2gl1jHVCfR%2fjvBqNe9fE6vMnuCcqiwj9FzGCw1Jq861kqem2zYB7tIRNwNtSLO4CV6jzwHyj3KcPAO80c5jCO5dlqgMZYLVMtATgwlsNwDSvEU6LDmAnlVpDDBemtw%3d%3d&fich=InformacaoBaseXVI_json.txt&Inline=true"
const initiativesFileUrl = "https://app.parlamento.pt/webutils/docs/doc.txt?path=g2Builcz%2b3tODcigVmsR6BwyZqotrxf56gbQvjnG%2fq75xu9faoj0yAAyUUcVO9CwcAJ90PfzitH5Qh7iEkYcjVx3O5UWJQU5QpDNW1n7rHgiYP2TU3sbziWfjASWsIWkJIC854lXagYfjER5Tlj8zUtrrFefk2SFK%2fvFCjQHPuHroYNipl%2fP2O6GwcSws%2bbeFsbeG6LiZNlJDHZevgj4%2fKBROXX08Lwl0OtPPlPd3tMv7D8c8jNxwtgK8R160j08%2fLF1hRmm%2f0KoayeMNEODvUFMOgBnpKqyfrpsX7YWviTbjOwJzEL8yajE%2bAUnrRJdoOLI7gKDPAXXkq90Sh97iKPplVHDt3wBKTlx3vL9nQk%3d&fich=IniciativasXVI_json.txt&Inline=true"

dotenv.config()

let parliamentGroupRepository: Repository<ParliamentGroup>
let deputeeRepository: Repository<Deputee>

async function fetchFile(url: string): Promise<string> {
    const response = await fetch(baseInfoFileUrl)
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

    await parliamentGroupRepository.save(parliamentGroups)

    let deputeesToInsert: Deputee[] = []

    for(let parlamentGroup of parliamentGroups) {
        deputeesToInsert = deputeesToInsert.concat(mappedDeputees
            .filter((dep: any) => dep.parliamentGroupAcronym === parlamentGroup.acronym)
            .map((dep: any) => new Deputee(dep.id, dep.name, parlamentGroup)))
    }

    deputeeRepository.save(deputeesToInsert)
}

async function crawlInitiatives() {
    console.log("Fetching initiatives file")
    var result = await fetchFile(initiativesFileUrl)
    console.log("Fetched initiatives file")
    
    
}

(async function() {

    await AppDataSource.initialize()

    parliamentGroupRepository = AppDataSource.getRepository(ParliamentGroup)
    deputeeRepository = AppDataSource.getRepository(Deputee)

    console.log("Clearing database")
    await deputeeRepository.clear()
    await parliamentGroupRepository.clear()
    console.log("Cleared database")


    await crawlBaseInfo()

})()


