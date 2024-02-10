export default interface dbConnector{
    getParliamentGroups(): Promise<any[]>;
    getParliamentGroupByAcronym(acronym:string): Promise<any>;
}