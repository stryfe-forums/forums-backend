import { LoggerModes } from '@overnightjs/logger';
import { unlinkSync } from 'fs';
import { join } from 'path';

import { Router } from './Router/RouterServer';

// Set environment variables for logger.
const logFilePath = join(__dirname, '../stryfe-backend.log');
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.Console;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'false';

// Remove current log file.
(() => {
	try {
		unlinkSync(logFilePath);
	} catch (e) { return; }
})();

const server = new Router();

server.start();
