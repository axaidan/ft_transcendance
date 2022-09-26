import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-42";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor(
        configService: ConfigService
    ) {
        super({
            authorizationURL: configService.get("API_BASE_URL"),
            tokenURL        : configService.get("API_TOKEN_URL"),
            clientID        : configService.get("API_CLIENT_UID"),
            clientSecret    : configService.get("API_CLIENT_SECRET"),
            callbackURL     : configService.get("API_REDIRECT_URI"),
            scope           : configService.get("API_SCOPE")
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) 
    : Promise<any> {
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            profile: profile.username
        };
    }
}