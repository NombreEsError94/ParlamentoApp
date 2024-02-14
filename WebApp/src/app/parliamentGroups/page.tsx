import SqliteConnector from "../lib/data";

export default async function ParliamentGroups(){

    const connector = new SqliteConnector('../DataExtractor/python/parliament.db');
    const parliamentGroups = await connector.getParliamentGroups();
    var display = [];

    for(let i=0; i < parliamentGroups.length; i++)
    {
        display.push(<li key={parliamentGroups[i].acronym}>{parliamentGroups[i].name} ({parliamentGroups[i].acronym})</li>)
    }

    return <>
        <h1>Parliament Groups</h1>
        <ul>
            {display}
        </ul>
    </>
}