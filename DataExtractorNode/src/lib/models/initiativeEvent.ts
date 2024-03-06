import Vote from "./vote";

export default interface InitiativeEvent {
    id: number,
    phase: string,
    date: Date,
    votes: Vote | null
}