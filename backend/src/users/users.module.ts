import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { FtStrategy } from '../auth/strategie';
import { AppGateway } from 'src/app.gateway';
import { AppModule } from 'src/app.module';

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		FtStrategy,
		AppGateway,
	],
	// exports: [
		// UserService,
	// ]
})
export class UserModule {}