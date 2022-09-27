import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendLoginToken(user: User, token: string) {
        const url= `http://localhost:3000/auth/mail-callback?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: "user.loginLogin link",
            template: '/back/dist/mail/templates/2faAuth',
            context: {
                name: user.login,
                url,
            },
        });
        console.log('sendloginToken() - email sent to ' + user.login + ' at ' + user.email);
    }
}
