import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendLoginToken(user: User, token: string): Promise<void>;
}
