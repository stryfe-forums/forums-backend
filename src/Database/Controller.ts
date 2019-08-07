import { createConnection, Connection } from 'typeorm';
import { HelloWorldModel } from '../Models/HelloWorld';

/**
 * @description This serves as an interface for our Database.
 * @author Zoro
 */
export class TypeORMController {

	private handler?: Connection;

	public async getConnection() {
		this.handler = await createConnection({
			type: 'postgres',
			host: '127.0.0.1', // @TODO: Don't assume the postegres server is on the same machine. read this value from the environment variables instead.
			port: 5432,
			entities: [HelloWorldModel] // Don't change this unelss you know what you're doing
		});

		await this.handler.synchronize();

		return this.handler;
	}
}
