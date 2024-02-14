import SqliteConnector from "../../lib/data";

export default async function ParliamentGroup({ params }: { params: { acronym: string } }){

    const { acronym } = params;

    const connector = new SqliteConnector('../DataExtractor/python/parliament.db');
    const parliamentGroup = await connector.getParliamentGroupByAcronym(acronym);

    return <>
        <h1>Parliament Groups</h1>
        <p>{parliamentGroup.name} ({parliamentGroup.acronym})</p>
    </>
}