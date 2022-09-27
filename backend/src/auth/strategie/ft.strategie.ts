import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
	constructor(conf: ConfigService) {
		super({
			authorizationURL: conf.get('API_AUTH_URL'),
			tokenURL: conf.get('API_TOKEN_URL'),
			clientID: conf.get('API_UID42'),
			clientSecret: conf.get('API_SECRET42'),
			callbackURL: conf.get('RED_URI'),
		});
	}
	async validate( access_token: string, refresh_token: string, profile: Profile ): Promise<string> {
		return profile.username;
	}
}