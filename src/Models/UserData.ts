import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stryfeUserAuthData')
export class UserAuthData {
	@PrimaryColumn()
	public readonly id!: string;

	@Column()
	public jwtToken: string;

	@Column()
	public access_token: string;

	@Column()
	public refresh_token: string;
}
