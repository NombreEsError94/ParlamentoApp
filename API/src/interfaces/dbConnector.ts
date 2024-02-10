import ParliamentGroup from "../models/parliamentGroup";
import Initiative from "../models/initiative";
import Vote from "../models/vote";

export default interface dbConnector{
    getParliamentGroups(): Promise<ParliamentGroup[]>;
    getParliamentGroupByAcronym(acronym:string): Promise<ParliamentGroup>;
    getInitiatives(): Promise<Initiative[]>;
    getInitiativeById(id:number): Promise<Initiative>;
    getVotesByInitiativeId(initiativeId:number): Promise<Vote[]>;
}