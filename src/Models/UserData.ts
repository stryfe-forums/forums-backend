import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('stryfeUserData')
export class UserData {

	@PrimaryColumn()
	public readonly id: string;

	@Column()
	public access_tokens: any; // @TODO: IMPLEMENT THIS 4HEAD
}