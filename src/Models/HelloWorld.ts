import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stryfe_hello_world')
export class HelloWorldModel {

	@PrimaryGeneratedColumn()
	public readonly id: string;

	@Column()
	public hello: string;

}
