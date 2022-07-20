import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { randomUUID } from 'crypto'
import { Company } from './Company'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    email: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    role: string

    @Column()
    company_id?: string

    @JoinColumn({ name: 'company_id' })
    @ManyToOne(() => Company)
    companyData?: Company

    constructor (
      name: string,
      email: string,
      password: string,
      role: string
    ) {
      if (!this.user_id) {
        this.user_id = randomUUID().toString()
      }
      this.name = name
      this.email = email
      this.password = password
      this.role = role
    }
}
