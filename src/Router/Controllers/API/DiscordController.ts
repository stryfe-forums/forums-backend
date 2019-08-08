import { Controller, Get } from '@overnightjs/core';
import { JwtManager } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { OK } from 'http-status-codes';

import fetch from 'node-fetch';
import btoa from 'btoa';
import jwt from 'jsonwebtoken';

import { UserAuthData } from '../../../Models';
import { TypeORMController } from '../../../Database';

@Controller('api/discord')
export class DiscordAPIController {

	constructor(public database: TypeORMController) {
		this.database = database;
	}

	private redirect: string = encodeURIComponent('http://localhost:3000/api/discord/callback'); // @TODO: Make sure to read from env variables instead.
	private jwt = new JwtManager(process.env.JWT_SECRET!, '7d');

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
		const userInfo = await this.getUserInfo(json.access_token);
		const entry = await this.database.getModel<UserAuthData>('userAuthData').findOne({ jwtToken: req.query.state });

		if (entry) return res.status(OK).json({ payload: entry.jwtToken });

		const payload = this.jwt.jwt({
			access_token: json.access_token,
			user_id: userInfo.id,
			refresh_token: json.refresh_token
		});

		const data = new UserAuthData();
		data.id = userInfo.id;
		data.jwtToken = payload;

		await this.database.getModel<UserAuthData>('userAuthData').save(data);

		return res.status(OK).json({
			payload, 
			userInfo: {
				id: userInfo.id,
				avatar: userInfo.avatar,
				username: userInfo.username,
				flags: userInfo.flags
			}
		});
	}

	private async getUserInfo(accessToken: string) {
		const response = await fetch('https://discordapp.com/api/v6/users/@me', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/x-www-urlencoded'
			}
		});

		const data = await response.json();
		return data;
	}
}
