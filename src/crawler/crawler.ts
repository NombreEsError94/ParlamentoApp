import Deputee from "../models/deputee"
import ParliamentGroup from "../models/parliamentGroup"
import * as databaseService from "../services/database.service"
import { addParliamentGroup, getParliamentGroups, clear } from "../services/parliamentGroup.service"
import dotenv from 'dotenv'

const baseInfoFileUrl = "https://app.parlamento.pt/webutils/docs/doc.txt?path=jVZ4y7bbSU9PqO%2bm%2b8fNSBAhYxL2VhBgnxFPNTtU%2fuXfzUZ6mDl0UDZ2mncN9bn3cS6kw12HWzY4oxYnmwfDK2d%2f48815k%2fWWSigAiZUJFQg%2brcwOxbsZONWxKVvA0A%2fVD8m6ItfWIEmFfrPnqEayfHFEEULgFi%2fZD4iL%2fSC07j1fmkeHWIR4PQX7%2fJooiscVeQxAwibS%2fl39xyDpwg9H8RjHr84rxAw2Zkn8UlZX3WMsV81Mnkva2lF3wG5shv75olGq4TjSukJFncSGnzmOrcA2gl1jHVCfR%2fjvBqNe9fE6vMnuCcqiwj9FzGCw1Jq861kqem2zYB7tIRNwNtSLO4CV6jzwHyj3KcPAO80c5jCO5dlqgMZYLVMtATgwlsNwDSvEU6LDmAnlVpDDBemtw%3d%3d&fich=InformacaoBaseXVI_json.txt&Inline=true"

dotenv.config()

async function fetchFile(url: string): Promise<string> {
    const response = await fetch(baseInfoFileUrl)
    return await response.text()
}

(async function() {
    await databaseService.connectToDatabase()

    console.log("Clearing database")

    await clear()

    console.log("Cleared database")

    var result = await fetchFile(baseInfoFileUrl)

    console.log("Fetched file")

    var parsedObject = JSON.parse(result)

    var parlamentGroups = parsedObject.Legislatura.GruposParlamentares["pt_gov_ar_objectos_GPOut"]
    var deputees = parsedObject.Legislatura.Deputados["pt_ar_wsgode_objectos_DadosDeputadoSearch"]

    var mappedDeputees = deputees.map((element: any) => {
        return {
            id: element.depId,
            name: element.depNomeCompleto,
            parliamentGroupName: element.depGP["pt_ar_wsgode_objectos_DadosSituacaoGP"].gpSigla
        }
    })

    var mapped: ParliamentGroup[] = parlamentGroups.map((element: { sigla: string; nome: string }) => {
        const relevantDeputees: Deputee[] = mappedDeputees
            .filter((dep: any) => dep.parliamentGroupName === element.sigla)
            .map((dep:any) => new Deputee(dep.id, dep.name))
        return new ParliamentGroup(element.sigla, element.nome, relevantDeputees)
    } )

    console.log("Adding parliament groups to database")

    for(var i = 0; i < mapped.length; i++) {
        await addParliamentGroup(mapped[i])
    }

    return
})()


