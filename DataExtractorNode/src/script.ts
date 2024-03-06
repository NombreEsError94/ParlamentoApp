require("dotenv").config()

import { downloadXmlFile } from "./utils/fileDownloader";
import { XMLParser } from "fast-xml-parser";
import { MongoClient } from "mongodb";

import Deputee from "./lib/models/deputee";
import ParliamentGroup from "./lib/models/parliamentGroup";
import Initiative from "./lib/models/initiative";
import InitiativeEvent from "./lib/models/initiativeEvent";
import Vote from "./lib/models/vote";

async function main(){
    const parliamentGroupsFileUrl = process.env.PARLIAMENT_GROUPS_FILE_URL || '';
    const initiativesFileUrl = process.env.INITIATIVES_FILE_URL || '';


    const parliamentGroupsContent = await downloadXmlFile(parliamentGroupsFileUrl);
    console.log('Parliament groups file downloaded');

    const parser = new XMLParser();
    let jObj = parser.parse(parliamentGroupsContent);
    const parliamentGroupNode = jObj.Legislatura.GruposParlamentares.pt_gov_ar_objectos_GPOut;
    const deputeesNode = jObj.Legislatura.Deputados.pt_ar_wsgode_objectos_DadosDeputadoSearch;
    let parliamentGroups: ParliamentGroup[] = [];
    let deputees: Deputee[] = [];
    let initiatives: Initiative[] = [];
    
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
    await parliamentGroupsCollection.drop();

    await parliamentGroupsCollection.insertMany(parliamentGroups);

    await new Promise(f => setTimeout(f, 1000));
    const initiativesContent = await downloadXmlFile(initiativesFileUrl);
    console.log('Initiatives file downloaded');

    let initiativesJObj = parser.parse(initiativesContent);

    const initiativesNode = initiativesJObj.ArrayOfPt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut.pt_gov_ar_objectos_iniciativas_DetalhePesquisaIniciativasOut

    for(let nodeItem of initiativesNode){
        const eventsNode = nodeItem.iniEventos.pt_gov_ar_objectos_iniciativas_EventosOut
        const events: InitiativeEvent[] = [];

        for(let eventItem of eventsNode){
            let vote: Vote|null = null;

            if(eventItem.votacao){
                if(eventItem.votacao.pt_gov_ar_objectos_VotacaoOut.length > 1){
                    console.log("Vote for event id " + eventItem.oevId + " has more than one vote");
                }
                
                const voteNode = eventItem.votacao.pt_gov_ar_objectos_VotacaoOut[0]
                vote = {
                    id: voteNode.id,
                    date: voteNode.data,
                    result: voteNode.resultado,
                    details: voteNode.detalhe
                }
            }

            const event: InitiativeEvent = {
                id: eventItem.oevId,
                phase: eventItem.fase,
                date: eventItem.dataFase,
                votes: vote
            }

            events.push(event);
        }

        const initiative: Initiative = {
            id: nodeItem.iniId,
            textLink: nodeItem.iniLinkTexto,
            title: nodeItem.iniTitulo,
            events: events
        }

        initiatives.push(initiative);
    }

    const initiativesCollection = database.collection('initiatives');
    await initiativesCollection.drop();

    await initiativesCollection.insertMany(initiatives);

    await client.close();
}

main()