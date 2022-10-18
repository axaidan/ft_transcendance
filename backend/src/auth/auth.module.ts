import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, FtStrategy} from './strategie';
import { UserService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { AppGateway } from 'src/app.gateway';

@Module({
	imports: [
		JwtModule.register({}),
		MailModule
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		FtStrategy,
		UserService,
		AppGateway,			// JUST TO BE ABLE TO INCLUDE UserService
	]
})

export class AuthModule {}