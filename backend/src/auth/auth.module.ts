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
    PassportModule.register({
      // authorizationURL: "https://api.intra.42.fr/oauth/authorize",
      // tokenURL        : "https://api.intra.42.fr/oauth/token",
      // clientID        : "e2490141d47b00fb9223d0b888dac274479cbc467c03e4a7f2fcc2154c8817ff",
      // clientSecret    : "bc813f276f1c8f5dffe0b637b4802617bcf67bd4bfd5bc96b648deaa09310667",
      // callbackURL     : "http://localhost:3000/auth/intra-callback",
      // scope           : "public",
  })
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy]
})
export class AuthModule {}
