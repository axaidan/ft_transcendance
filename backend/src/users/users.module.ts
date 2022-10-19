import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { FtStrategy } from '../auth/strategie';

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		FtStrategy,
	],
})
export class UserModule {}