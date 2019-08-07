import { Repository } from 'typeorm';
import { HelloWorldModel } from '../Models';

export interface TypeORMModels {
	helloWorld: Repository<HelloWorldModel>;
}
