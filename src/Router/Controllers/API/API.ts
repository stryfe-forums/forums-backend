import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

@Controller('api/home')
export class APIController {

	@Get('/')
	private getAPIHomePage(req: Request, res: Response) {
		res.status(OK).send('Hello from the Stryfe API');
	}
}