import Deputee from "./deputee";

export default interface ParliamentGroup{
    acronym: string,
    name: string,
    deputees: Deputee[]
}