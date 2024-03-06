import InitiativeEvent from "./initiativeEvent";

export default interface Initiative{
    id: number,
    textLink: string,
    title: string,
    events: InitiativeEvent[]
}