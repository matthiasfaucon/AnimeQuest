import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Movie } from "./entity/Movie"
import { Category } from "./entity/Categories"

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: "database.sqlite",
	synchronize: true,
	logging: false,
	entities: [User, Movie, Category],
	migrations: [],
	subscribers: [],
})
