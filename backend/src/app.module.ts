import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { AchivModule } from './achiv/achiv.module';
import { RelationModule } from './relations/relation.module';
import { DiscussionModule } from './discussion/discussion.module';
import { DiscussionMessageModule } from './discussion-message/discussion-message.module';
import { GameModule } from './game/game.module';
import { AppController } from './app.controller';

// CHAT FRONT TESTS - BEGIN
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AlertController } from './alert/alert.controller';
import { AlertGateway } from './alert/alert.gateway';
// CHAT FRONT TESTS - END

@Module({
	imports: [
		// CHAT FRONT TESTS - BEGIN
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'static_chat_front_test'),
		}),
		// CHAT FRONT TESTS - END
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		MailModule,
		AchivModule,
		RelationModule,
		DiscussionModule,
		DiscussionMessageModule,
		GameModule,
	],
	providers: [AlertGateway],
	controllers: [AppController, AlertController]
})
export class AppModule {}
