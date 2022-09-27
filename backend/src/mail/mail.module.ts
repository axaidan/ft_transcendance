import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get("MAILER_HOST"),
                    secure: true,
                    auth: {
                        user: configService.get("MAILER_ADDRESS"),
                        pass: configService.get("MAILER_PASSWORD"),
                    },
                },
                defaults: {
                    from: `"No Reply" <${configService.get("MAILER_FROM")}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService], // export for DI (??)
})
export class MailModule {}
