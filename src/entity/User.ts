import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id!: number

	@Column('varchar')
	firstName!: string

	@Column('varchar')
	lastName!: string

	@Column('int')
	age!: number

	@Column('varchar')
	profile_picture_path!: string

}
