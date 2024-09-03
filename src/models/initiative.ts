import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { InitiativeEvent } from "./initiativeEvent";

@Entity({ name: 'initiatives' })
export class Initiative {
    
    constructor(id: string, startDate: string, title: string) {
        this.id = id
        this.startDate = startDate
        this.title = title
    }

    @PrimaryColumn()
    id: string

    @Column()
    startDate: string

    @Column()
    title: string

    @OneToMany(() => InitiativeEvent, (eve) => eve.initiativeId)
    events: Event[] | undefined
}