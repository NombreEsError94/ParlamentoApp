require("dotenv").config()

import { downloadXmlFile } from "./utils/fileDownloader";
import { XMLParser } from "fast-xml-parser";

async function main(){
    const parliamentGroupsFileUrl = process.env.PARLIAMENT_GROUPS_FILE_URL || '';
    const initiativesFileUrl = process.env.INITIATIVES_FILE_URL || '';


    const parliamentGroupsContent = await downloadXmlFile(parliamentGroupsFileUrl);
    console.log('Parliament groups file downloaded');

    const parser = new XMLParser();
    let jObj = parser.parse(parliamentGroupsContent);
    const parliamentGroupNode = jObj.Legislatura.GruposParlamentares.pt_gov_ar_objectos_GPOut;
    
    for(let nodeItem of parliamentGroupNode){
        console.log(nodeItem.sigla);
        console.log(nodeItem.nome);
    }

    //const initiativesContent = await downloadXmlFile(initiativesFileUrl);
    //console.log('Initiatives file downloaded');
}

main()