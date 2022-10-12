import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private prisma;
    private conf;
    private jwt;
    private mailService;
    constructor(prisma: PrismaService, conf: ConfigService, jwt: JwtService, mailService: MailService);
    signin(login: string): Promise<string>;
    signToken(userId: number, login: string): Promise<{
        access_token: string;
    }>;
    signinTest(login: string): Promise<string>;
}
