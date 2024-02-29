import axios from "axios";

export async function downloadXmlFile(url: string) {

    const instance = axios.create({
        baseURL: url,
        timeout: 100000,
      });

    console.log("Starting download");
    const response = await instance.get(url, { responseType: 'stream' });
    const chunks = response.data;

    let contents = '';
    for await(let chunk of chunks){
        contents+= chunk
    }

    return contents;
}