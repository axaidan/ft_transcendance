import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-oauth2";
import { HttpService } from "@nestjs/axios";
import { AuthService } from "./auth.service";
import { Profile, Strategy } from "passport-oauth2";
// import { Profile } from "passport";

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor(
        private http: HttpService,
        private authService: AuthService,
    ) {
        super({
            authorizationURL: "https://api.intra.42.fr/oauth/authorize",
            tokenURL        : "https://api.intra.42.fr/oauth/token",
            clientID        : "e2490141d47b00fb9223d0b888dac274479cbc467c03e4a7f2fcc2154c8817ff",
            clientSecret    : "bc813f276f1c8f5dffe0b637b4802617bcf67bd4bfd5bc96b648deaa09310667",
            callbackURL     : "http://localhost:3000/auth/intra-callback",
            scope           : "public",
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile
        ) : Promise<any> {
        const data  = await this.http.get("https://api.intra.42.fr/v2/me", {
            headers: { "Authorization": `Bearer ${ accessToken  } ` },
        }).toPromise();
        
        console.log( data );
        return (true);
    }

        // let bodyFormData = new FormData();
        // bodyFormData.append('grant_type', 'authorization_code');
        // bodyFormData.append('client_id', 'e2490141d47b00fb9223d0b888dac274479cbc467c03e4a7f2fcc2154c8817ff');
        // bodyFormData.append('client_secret', 'bc813f276f1c8f5dffe0b637b4802617bcf67bd4bfd5bc96b648deaa09310667');
        // bodyFormData.append('code', code);
        // bodyFormData.append('redirect_uri', '/auth');

        // const response = await this.http.post(
        //     "https://api.intra.42.fr/oauth/token",
        //     bodyFormData,
        // ).toPromise();
        // console.log(response.data);

        // return this.authService.findUserFromIntraUsername(data.id);

}