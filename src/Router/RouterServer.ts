import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import bodyParser = require('body-parser');
import { OK } from 'http-status-codes';
import * as Controllers from './Controllers';

export class Router extends Server {
	public constructor() {
		// set showLogs to true
		super(true);

		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.setupControllers();
	}

	private setupControllers(): void {
		const controllerInstances: any = [];
		for (const name of Object.keys(Controllers)) {
			const controller = (Controllers as any)[name];
			if (typeof controller === 'function') {
				controllerInstances.push(new controller());
			}
		}
		super.addControllers(controllerInstances);
	}

	public async start(): Promise<void> {
		this.app.get('/', (req, res) => {
			res.status(OK).send('Hello from Stryfe Forums!');
		});
		this.app.listen(3000, () => {
			Logger.Info('Server listening on port 3000');
		});
	}
}
