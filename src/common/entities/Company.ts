import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { randomUUID } from 'crypto'

@Entity('companys')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    company_id: string

    @Column({ nullable: false })
    name: string

    constructor (
      name: string
    ) {
      if (!this.company_id) {
        this.company_id = randomUUID().toString()
      }
      this.name = name
    }
}
