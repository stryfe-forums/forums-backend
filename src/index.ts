import { LoggerModes } from '@overnightjs/logger';
import * as fs from 'fs';
import * as path from 'path';

import { Router } from './Router/RouterServer';

// Set environment variables for logger.
const logFilePath = path.join(__dirname, '../stryfe-backend.log');
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.Console;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'false';

// Remove current log file.
(function removeFile() {
	try {
		fs.unlinkSync(logFilePath);
	} catch (e) { return; }
})();

const server = new Router();

server.start();
