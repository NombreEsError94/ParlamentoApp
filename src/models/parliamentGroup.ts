import Deputee from "./deputee";

export default class ParliamentGroup {
    constructor(
        public acronym: string,
        public name: string,
        public deputees: Deputee[]
    ) {}
}