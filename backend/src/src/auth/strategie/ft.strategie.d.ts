import { ConfigService } from "@nestjs/config";
import { Profile } from "passport-42";
declare const FtStrategy_base: new (...args: any[]) => any;
export declare class FtStrategy extends FtStrategy_base {
    constructor(conf: ConfigService);
    validate(access_token: string, refresh_token: string, profile: Profile): Promise<string>;
}
export {};
