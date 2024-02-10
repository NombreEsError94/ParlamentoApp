export default interface dbConnector{
    connect(): void;
    getParliamentGroups(): Promise<any[]>;
}