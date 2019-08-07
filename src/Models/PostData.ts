import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('stryfeForumPosts')
export class Post {

	@PrimaryColumn()
	public readonly id!: string;

}