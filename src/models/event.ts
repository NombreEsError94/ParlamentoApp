import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Initiative } from "./initiative"

@Entity({ name: 'events' })
export class Event {
    
    constructor(id: string, date: string, phase: string, initiative: Initiative) {
        this.id = id
        this.date = date
        this.phase = phase
        this.initiative = initiative
        this.initiativeId = initiative?.id ?? ""
    }

    @PrimaryColumn()
    id: string

    @Column()
    date: string

    @Column()
    phase: string

    @ManyToOne(() => Initiative, (ini) => ini.id)
    @JoinColumn( {name: "initiativeId"})
    initiative: Initiative

    @Column()
    initiativeId: string
}