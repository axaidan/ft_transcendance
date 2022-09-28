import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { AchivModule } from './achiv/achiv.module';

@Module({
  imports: [
	  ConfigModule.forRoot({
		  isGlobal: true,
	  }),
	  PrismaModule,
	  AuthModule,
	  UserModule,
		AchivModule]
})
export class AppModule {}
