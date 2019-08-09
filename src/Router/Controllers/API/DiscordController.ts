import { Controller, Get, Middleware } from '@overnightjs/core';
import { JwtManager } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { OK, BAD_REQUEST } from 'http-status-codes';

import fetch from 'node-fetch';
import btoa from 'btoa';
import jwt, { decode } from 'jsonwebtoken';
import url from 'url';

import { UserAuthData } from '../../../Models';
import { TypeORMController } from '../../../Database';
import { JWTBody } from '../../../Interfaces';

@Controller('discord')
export class DiscordAPIController {

	constructor(public database: TypeORMController) {
		this.database = database;
	}

	private redirect: string = encodeURIComponent('http://localhost:3000/api/discord/callback'); // @TODO: Make sure to read from env variables instead.
	private jwt = new JwtManager(process.env.JWT_SECRET!, '7d');

	@Get('login')
	private getLogin(req: Request, res: Response) {
		return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=525465644578111498&scope=identify&response_type=code&redirect_uri=${this.redirect}`);
	}

	@Get('callback')
	private async getCallback(req: Request, res: Response) {
		if (!req.query.code) throw new Error('No code was provided.');

		const code = req.query.code;
		const creds = btoa(process.env.JWT_SECRET);

		const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${this.redirect}`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${creds}`
			}
		});

		const json = await response.json();
		const userInfo = await this.getUserInfo(json.access_token);

		const payload = this.jwt.jwt({
			access_token: json.access_token,
			user_id: userInfo.id,
			refresh_token: json.refresh_token
		});

		const data = new UserAuthData();
		data.id = userInfo.id;
		data.jwtToken = payload;

		await this.database.getModel<UserAuthData>('userAuthData').save(data);
		
		return res.redirect(url.format({ // @TODO: Refactor all the things and make them read from environment variables
			host: 'http://localhost:3000/api/discord/loggedin',
			query: {
				payload,
				user_id: userInfo.id,
				user_name: userInfo.username
			}
		}));
	}

	@Get('loggedin')
	private async getLoggedIn(req: Request, res: Response) {
		return res.send('You have been logged in successfully!');
	}

	@Get('verify')
	private async getVerify(req: Request, res: Response) {
		const state = req.query;

		if (!state.token) return res.status(BAD_REQUEST).json({ valid: false, error: 'Missing JWT!' });

		const decoded = jwt.verify(state.token! as string, process.env.JWT_SECRET!) as JWTBody;

		const entry = await this.database.getModel<UserAuthData>('userAuthData').findOne({ id: state.id });

		if (state.token !== entry!.jwtToken) return res.status(BAD_REQUEST).redirect(`http://localhost:3000/discord/loggedin?valid=false&reason=${encodeURIComponent('token does not match or is malformed!')}`);

		if (decoded.exp < Date.now()) return res.status(OK).redirect(`http://localhost:3000/discord/loggedin?valid=false&reason=${encodeURIComponent('Token expired.')}`);

		return res.status(OK).redirect('http://localhost:3000/discord/loggedin?valid=true&reason=false');
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
