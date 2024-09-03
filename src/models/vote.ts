import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("vote")
export class Vote {
    
    constructor(id: string, result: string, date: string, details: string) {
        this.id = id
        this.result = result
        this.date = date
        this.details = details
    }

    @PrimaryColumn()
    id: string

    @Column()
    result: string
    
    @Column()
    date: string

    @Column()
    details: string
}