import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { Movie } from "./Movie"

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number | undefined

	@Column('varchar')
	name: string | undefined

	@Column('varchar', { nullable: true })
	description: string | undefined

	@ManyToMany(() => Movie, (movie) => movie.categories)
	movies: Movie[] | undefined
}
