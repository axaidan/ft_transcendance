import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { AchivModule } from './achiv/achiv.module';
import { RelationModule } from './relations/relation.module';
import { DiscussionModule } from './chat/discussion/discussion.module';
import { DiscussionMessageModule } from './chat/discussion-message/discussion-message.module';
import { GameModule } from './game/game.module';
import { AvatarModule } from './avatar/avatar.module';
import { AppGateway } from './app.gateway';
import { ChatModule } from './chat/chat.module';
import { LobbyModule } from './lobby/lobby.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		MailModule,
		AchivModule,
		RelationModule,
		GameModule,
		AvatarModule,
		ChatModule,
		LobbyModule,
	],
	providers: [
	]
})
export class AppModule {}
