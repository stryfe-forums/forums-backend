import { Repository } from 'typeorm';
import { UserAuthData, Post } from '../Models';

export interface TypeORMModels {
	userAuthData: Repository<UserAuthData>;
	postData: Repository<Post>
}
