import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

@Controller('api/discord')
export class DiscordAPIController {
	@Get('/')
	private getAPIHomePage(req: Request, res: Response) {
		res.status(OK).send('Hello from the Stryfe API (Discord Controller)');
	}
}
