import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/users/users.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  
  let dummyUser: User;
  let dummyJwt: {access_token: string};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    await app.listen(3333);
    
    prisma = app.get(PrismaService);
    authService = app.get(AuthService);
    dummyUser = await prisma.user.create({
      data: {
        login: 'dummy',
        email: 'dummy@student.42.fr',
      }
    }
    );
    dummyJwt = await authService.signToken(dummyUser.id, dummyUser.login);
    console.log(dummyUser);
    console.log(dummyJwt);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  // describe('Auth', () => {});


  describe('User', () => {
    console.log(dummyUser);
    console.log(dummyJwt);
    it.todo('should fuck off');
  });
});