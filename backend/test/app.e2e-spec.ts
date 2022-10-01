import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../src/users/users.service';
import { AppModule } from '../src/app.module';
import { EditUserDto } from 'src/users/dto/edit-user.dto';

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
    await prisma.cleanDb();
    
    // DUMMY USER AND JWT INIT
    dummyUser = await prisma.user.create({
        data: {
          login: 'dummy',
          email: 'dummy@student.42.fr',
        }
      }
    );
    dummyJwt = await authService.signToken(dummyUser.id, dummyUser.login);
    // SET baseUrl FOR PACTUM
    pactum.request.setBaseUrl('http://localhost:3333');
    // STORE JwtAccessToken IN PACTUM FOR REUSE- NOT WORKING
    // pactum.spec().stores('userAt', 'dummyJwt.access_token');

  });

  afterAll(() => {
    app.close();
  });

  describe('User', () => {

    describe('GetMe()', () => {

      it('VALID JWT - should get current user', () => {
        return pactum
        .spec()
        .get('/user/me')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .expectStatus(200)
        /*.inspect()*/;
      });  
      it('NO JWT - should return 401', () => {
        return pactum
        .spec()
        .get('/user/me')
        .expectStatus(401);
      });
      it('WRONG JWT - should return 401', () => {
        return pactum
        .spec()
        .get('/user/me')
        .withHeaders({
          Authorization: `Bearer blablabla`
        })
        .expectStatus(401);
      });
      
    });
    describe('EditUser()', () => {

      const baseDto: EditUserDto = {
        email: 'dummy@gmail.com',
        username: 'LoveDummyDu93',
        twoFactorAuth: true,
      }

      it('VALID EMAIL, USERNAME, 2FA - should return 200', () => {
        const dto = baseDto;
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200)
        // .inspect()
        .expectBodyContains(dto.email)
        .expectBodyContains(dto.username)
        .expectBodyContains(dto.twoFactorAuth);
      });

      it('WRONG JWT, VALID REQUEST- should return 401', () => {
        const dto = baseDto;
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer blablabla`,
        })
        .withBody(dto)
        .expectStatus(401);
        // .inspect()
      });

      it('NON VALID EMAIL ONLY, VALID USERNAME, 2FA - should return 400', () => {
        const {...dto} = baseDto;
        dto.email = 'nonValidEmail';
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(400)
        // .inspect();
      });

      it('VALID EMAIL ONLY - should return 200', () => {
        const {username, twoFactorAuth, ...dto} = baseDto;
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200)
        // .inspect()
        .expectBodyContains(dto.email);
      });

      it('VALID USERNAME - should return 200', () => {
        const {email, twoFactorAuth, ...dto} = baseDto;
        dto.username = "HateDummyDu94";
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200)
        // .inspect()
        .expectBodyContains(dto.username);
      });

      it('VALID 2FA - should return 200', () => {
        const {username, email, ...dto} = baseDto;
        dto.twoFactorAuth = false;
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200)
        // .inspect()
        .expectBodyContains(dto.twoFactorAuth);
      });

      it('WRONG EMAIL - should return 400', () => {
        const {username, twoFactorAuth, ...dto} = baseDto;
        dto.email = 'nonValidEmail';
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(400);
        // .inspect()
        // .expectBodyContains(dto.email);
      });

      it('EMPTY USERNAME - should return 200, set username to null', () => {
        const {twoFactorAuth, email, ...dto} = baseDto;
        dto.username = '';
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200);
        // .inspect();
        // .expectBodyContains('null');
      });

      it('EMPTY DTO - should return 200', () => {
        const {twoFactorAuth, email, username, ...dto} = baseDto;
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200);
        // .inspect();
        // .expectBodyContains('null');
      });

      it('EXTRA PROPERTY - should return 200', () => {
        const dto = {
          email: 'dummy@hotmail.com',
          username: 'BoGossDummy',
          twoFactorAuth: true,
          extraProperty: "ok",
        };
        return pactum
        .spec()
        .patch('/user')
        .withHeaders({
          Authorization: `Bearer ${dummyJwt.access_token}`,
        })
        .withBody(dto)
        .expectStatus(200);
        // .inspect();
        // .expectBodyContains('null');
      });

    });

  });

});