import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stryfeUserAuthData')
export class UserAuthData {
	@PrimaryColumn()
	public id!: string;

	@Column()
	public jwtToken: string;

	@Column({ type: 'timestamp' })
	public expiresIn: number;
}
