import ParliamentGroupVote from "./parliamentGroupVote";

export default interface Vote{
    id: number;
    initiativeId: number;
    phase: string;
    result: string;
    votingDetails: string;
    date: string;
    parliamentGroupVotes: ParliamentGroupVote[];
}