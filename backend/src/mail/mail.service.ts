import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {
    }

    async sendLoginToken(user: User, token: string) {
        const url= `http://localhost:3000/auth/2fa-callback?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: `ft_transcendance - ${user.login} Login link`,
            template: '/back/dist/mail/templates/2faAuth',
            // template: './2faAuth',
            context: {
                name: user.login,
                url,
            },
        });
        // console.log('sendloginToken() - email sent to ' + user.login + ' at ' + user.email);
    }
}
