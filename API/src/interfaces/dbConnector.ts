import ParliamentGroup from "../models/parliamentGroup";

export default interface dbConnector{
    getParliamentGroups(): Promise<ParliamentGroup[]>;
    getParliamentGroupByAcronym(acronym:string): Promise<ParliamentGroup>;
}