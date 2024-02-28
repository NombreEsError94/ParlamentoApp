require("dotenv").config()

import axios from "axios";
import * as fs from 'fs';


async function downloadXmlFile(url: string, destination: string) {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(destination);
    response.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function main(){
    const parliamentGroupsFileUrl = process.env.PARLIAMENT_GROUPS_FILE_URL || '';
    const initiativesFileUrl = process.env.INITIATIVES_FILE_URL || '';
    const parliamentGroupsFileDestination = 'ParliamentGroups.xml';
    const initiativesFileDestination = 'Initiatives.xml';

    
    try{
        await downloadXmlFile(parliamentGroupsFileUrl, parliamentGroupsFileDestination);
        console.log('ParliamentGroups file downloaded');
        await downloadXmlFile(initiativesFileUrl, initiativesFileDestination);
        console.log('Initiatives file downloaded');
    }catch(error){
        console.error('Error downloading file');
    }
}

main()
