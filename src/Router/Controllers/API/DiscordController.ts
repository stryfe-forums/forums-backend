import { Controller, Get } from '@overnightjs/core';
import btoa from 'btoa';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { OK, BAD_REQUEST } from 'http-status-codes';


@Controller('api/discord')
export class DiscordAPIController {
	private redirect: string = encodeURIComponent('http://localhost:3000/api/discord/callback'); // @TODO: Make sure to read from env variables instead.

	@Get('login')
	private getLogin(req: Request, res: Response) {
		res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=525465644578111498&scope=identify&response_type=code&redirect_uri=${this.redirect}`);
	}

	@Get('callback')
	private async getCallback(req: Request, res: Response) {
		if (!req.query.code) throw new Error('No code was provided.');

		const code = req.query.code;
		const creds = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
		const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${this.redirect}`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${creds}`
			}
		});

		const json = await response.json();
		return res.status(OK).json(json);
	}

	@Get('getUserData')
	private async getUserInfo(req: Request, res: Response) {
		if (!req.query.token) return res.status(BAD_REQUEST).json({ error: 'Missing token' });

		const response = await fetch('https://discordapp.com/api/v6/users/@me', {
			headers: {
				Authorization: `Bearer ${req.query.token}`,
				'Content-Type': 'application/x-www-urlencoded'
			}
		});

		const data = await response.json();
		return res.status(OK).json(data);

	}
}
