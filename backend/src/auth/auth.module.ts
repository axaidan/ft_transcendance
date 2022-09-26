import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './intra.strategy';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    PassportModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy]
})
export class AuthModule {}
