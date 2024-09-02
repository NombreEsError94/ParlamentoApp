import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { ParliamentGroup } from "./ParliamentGroup";

@Entity({ name: "deputees"})
export class Deputee {

    constructor(id: string, name: string, parliamentGroup: ParliamentGroup) {
        this.id = id
        this.name = name
        this.parliamentGroup = parliamentGroup
        this.parliamentGroupAcronym = parliamentGroup?.acronym ?? ""
    }

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @ManyToOne(() => ParliamentGroup, (pg) => pg.acronym)
    @JoinColumn( {name: "parliamentGroupAcronym"})
    parliamentGroup: ParliamentGroup

    @Column()
    parliamentGroupAcronym: string
}