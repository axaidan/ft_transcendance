import { AuthService } from './auth.service';
import { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(req: Request): void;
    callback(req: Request, response: Response): Promise<void>;
    twoFaCallback(query: any, response: Response): void;
    signinTest(login: string, response: Response): Promise<void>;
}
