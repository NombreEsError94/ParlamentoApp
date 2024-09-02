import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from "typeorm";
import "reflect-metadata"
import { Deputee } from "./Deputee"

@Entity({ name: 'parliamentGroups'})
export class ParliamentGroup {

    constructor(acronym: string, name: string) {
        this.acronym = acronym
        this.name = name
    }

    @PrimaryColumn()
    acronym: string

    @Column()
    name: string

    @OneToMany(() => Deputee, (deputee) => deputee.parliamentGroup)
    deputees: Deputee[] | undefined
}