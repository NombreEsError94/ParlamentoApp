require("dotenv").config()

import { downloadXmlFile } from "./utils/fileDownloader";
import { XMLParser } from "fast-xml-parser";
import { MongoClient } from "mongodb";

import Deputee from "./lib/models/deputee";
import ParliamentGroup from "./lib/models/parliamentGroup";

async function main(){
    const parliamentGroupsFileUrl = process.env.PARLIAMENT_GROUPS_FILE_URL || '';
    const initiativesFileUrl = process.env.INITIATIVES_FILE_URL || '';


    const parliamentGroupsContent = await downloadXmlFile(parliamentGroupsFileUrl);
    console.log('Parliament groups file downloaded');

    const parser = new XMLParser();
    let jObj = parser.parse(parliamentGroupsContent);
    const parliamentGroupNode = jObj.Legislatura.GruposParlamentares.pt_gov_ar_objectos_GPOut;
    const deputeesNode = jObj.Legislatura.Deputados.pt_ar_wsgode_objectos_DadosDeputadoSearch;
    let parliamentGroups = [];
    let deputees: Deputee[] = [];
    
    for(let nodeItem of deputeesNode){
        const deputee: Deputee = {
            id: nodeItem.depId,
            name: nodeItem.depNomeParlamentar,
            party: nodeItem.depGP.pt_ar_wsgode_objectos_DadosSituacaoGP.gpSigla
        }

        deputees.push(deputee);
    }

    for(let nodeItem of parliamentGroupNode){
        const parliamentGroup: ParliamentGroup = {
            acronym: nodeItem.sigla,
            name: nodeItem.nome,
            deputees: deputees.filter(d => d.party === nodeItem.sigla)
        }

        parliamentGroups.push(parliamentGroup)
    }

    const client = new MongoClient(process.env.DB_CONNECTION_STRING || '');

    const database = client.db('parlamentoAppDB');
    const parliamentGroupsCollection = database.collection('parliamentGroups');

    await parliamentGroupsCollection.insertMany(parliamentGroups)

    await client.close();

    //await new Promise(f => setTimeout(f, 1000));
    //const initiativesContent = await downloadXmlFile(initiativesFileUrl);
    //console.log('Initiatives file downloaded');
}

main()