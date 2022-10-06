import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../src/users/users.service';
import { AppModule } from '../src/app.module';
import { EditUserDto } from 'src/users/dto/edit-user.dto';
import { parseConnectionUrl } from 'nodemailer/lib/shared';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  
  let dummyJwt: {access_token: string};
  let kyleUser: User 
  let hugoUser: User
  let angelUser: User

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
    const	dummyUser = await prisma.user.create({
        data: {
          login: 'dummy',
          email: 'dummy@student.42.fr',
        }
      }
    );

	kyleUser = await prisma.user.create({
		data: {
			login: 'kyle',
			email: 'kyle@student.42.fr'
		}
	  }
	);
 
	hugoUser = await prisma.user.create({
		data: {
			login: 'hugo',
			email: 'hugo@student.42.fr'
		}
	  }
	);  
	
	angelUser = await prisma.user.create({
		data: {
			login: 'angel',
			email: 'angel@student.42.fr'
		}
	  }
	);

	const achiv = await prisma.achievement.upsert({
		where: {title: '10 in a raw'},
		update: {}, 
		create: {
			title: '10 in a raw',
			descriptions: 'you play 10 game in a raw',
		},
	})

	const achiv1 = await prisma.achievement.upsert({
		where: {title: 'login'},
		update: {}, 
		create: {
			title: 'login',
			descriptions: 'you log for the first time',
		},
	})

	const achiv2 = await prisma.achievement.upsert({
		where: {title: 'first win'},
		update: {}, 
		create: {
			title: 'first win',
			descriptions: 'gg well played',
		},
	})

	const achiv3 = await prisma.achievement.upsert({
		where: {title: 'un curly'},
		update: {}, 
		create: {
			title: 'tiens un curly',
			descriptions: 'tu as ajouter ton premier ami',
		},
	})

	const game1 = await prisma.game.upsert({
		where: {id:1},
		update: {},
		create: {
				player1Id: dummyUser.id,
				score1: 2,
				player2Id: kyleUser.id,
				score2: 3,
		},
	})

	const game2 = await prisma.game.upsert({
		where: {id:2},
		update: {},
		create: {
				player1Id: dummyUser.id,
				score1: 2,
				player2Id: hugoUser.id,
				score2: 3,
		},
	})

	const game3 = await prisma.game.upsert({
		where: {id:3},
		update: {},
		create: {
				player1Id: kyleUser.id,
				score1: 2,
				player2Id: hugoUser.id,
				score2: 3,
		},
	})

	const game4 = await prisma.game.upsert({
		where: {id:4},
		update: {},
		create: {
				player1Id: dummyUser.id,
				score1: 3,
				player2Id: hugoUser.id,
				score2: 1,
		},
	})

	const game5 = await prisma.game.upsert({
		where: {id:5},
		update: {},
		create: {
				player1Id: kyleUser.id,
				score1: 2,
				player2Id: hugoUser.id,
				score2: 1,
		},
	})

	const game6 = await prisma.game.upsert({
		where: {id:6},
		update: {},
		create: {
				player1Id: angelUser.id,
				score1: 3,
				player2Id: kyleUser.id,
				score2: 1,
		},
	})

	const game7 = await prisma.game.upsert({
		where: {id:7},
		update: {},
		create: {
				player1Id: kyleUser.id,
				score1: 1,
				player2Id: angelUser.id,
				score2: 3,
		},
	})

	const friend1 = await prisma.relation.upsert({
		where : {id: 1},
		update: {},
		create: {
			userId: dummyUser.id ,
			userIWatchId: kyleUser.id,
			relation: 1,
		},
	})

	const friend2 = await prisma.relation.upsert({
		where : {id: 2},
		update: {},
		create: {
			userId: dummyUser.id ,
			userIWatchId: hugoUser.id,
			relation: 1,
		},
	})

	const friend3 = await prisma.relation.upsert({
		where : {id: 3},
		update: {},
		create: {
			userId: dummyUser.id ,
			userIWatchId: angelUser.id,
			relation: 1,
		},
	})

	const friend4 = await prisma.relation.upsert({
		where : {id: 4},
		update: {},
		create: {
			userId: angelUser.id ,
			userIWatchId: dummyUser.id,
			relation: 1,
		},
	})

	const friend5 = await prisma.relation.upsert({
		where : {id: 5},
		update: {},
		create: {
			userId: angelUser.id ,
			userIWatchId: kyleUser.id,
			relation: 1,
		},
	})

	const friend6 = await prisma.relation.upsert({
		where : {id: 6},
		update: {},
		create: {
			userId: hugoUser.id ,
			userIWatchId: angelUser.id,
			relation: 1,
		},
	})

	const friend7 = await prisma.relation.upsert({
		where : {id: 7},
		update: {},
		create: {
			userId: hugoUser.id ,
			userIWatchId: kyleUser.id,
			relation: 1,
		},
	})

	const block8 = await prisma.relation.upsert({
		where : {id: 8},
		update: {},
		create: {
			userId: angelUser.id ,
			userIWatchId: hugoUser.id,
			relation: 0,
			isBlock: 1,
		},
	})


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

	//here
	describe('Relation', () => {
		describe("list_friend", () => {
			it('Valid User - should lsit friend of cureent user', () => {
				return pactum
				.spec()
			  	.get('/relation/list_friend')
			  	.withHeaders({
				Authorization: `Bearer ${dummyJwt.access_token}`,
			   })
			  .expectStatus(200)
			});

			it('Valid User - should lsit friend of cureent user', () => {
				return pactum
				.spec()
				.get('/relation/list_friend')
				.withHeaders({
				Authorization: `Bearer `,
				})
				.expectStatus(401)
			});
		});
	});

	
		describe('add_user', () => {
			it('Should do nothing, already friend with user I try to add', () => {
				return pactum
				.spec()
				.post('/relation/add_friend')
				.withHeaders({
					Authorization: `Bearer ${(dummyJwt.access_token)}`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(201)
			});

			it('Should throw forbidden exception, userId invalid', () => {
				return pactum
				.spec()
				.post('/relation/add_friend')
				.withHeaders({
					Authorization: `Bearer ${(dummyJwt.access_token)}`,
				})
				.withBody({
					userId: -213,
				})
				.expectStatus(403);
			});


			it('Should do Error, bad bearer token', () => {
				return pactum
				.spec()
				.post('/relation/add_friend')
				.withHeaders({
					Authorization: `Bearer `,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectBodyContains("")
				.expectStatus(401)

		  	});

			it('should list friend of current user', () => {
			  return pactum
			  .spec()
			  .get('/relation/list_friend')
			  .withHeaders({
				   Authorization: `Bearer ${dummyJwt.access_token}`,
			   })
			  .expectStatus(200)
			   .expectBodyContains(kyleUser)
			   .expectBodyContains(hugoUser)
			   .expectBodyContains(angelUser)
			}); 
		});

		describe('remove_friend test', () => {

			it('remove a friend relation' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(201)
			});

			it('Should do nothing, bad Bearer token' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer 3r2qe432`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(401)
			});
	
			it('Should do nothing, bad userId', () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: 342391037812903812,
				})
				.expectStatus(403)
			});
			
			it('should list friend of current user after remove friend', () => {
			  return pactum
			  .spec()
			  .get('/relation/list_friend')
			  .withHeaders({
				   Authorization: `Bearer ${dummyJwt.access_token}`,
			   })
			  .expectStatus(200)
			  .expectBodyContains(kyleUser)
			  .expectBodyContains(angelUser)
			}); 

			it('remove a friend that not your friend ' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(201)
			});

			it('should list friend of current user after remove nothing', () => {
			  return pactum
			  .spec()
			  .get('/relation/list_friend')
			  .withHeaders({
				   Authorization: `Bearer ${dummyJwt.access_token}`,
			   })
			  .expectStatus(200)
			  .expectBodyContains(kyleUser)
			  .expectBodyContains(angelUser)
			}); 

			it('remove a friend ' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: kyleUser.id,
				})
				.expectStatus(201)
			});

			it('remove a friend ' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: angelUser.id,
				})
				.expectStatus(201)
			});

			it('should list friend of current user after remove all of them', () => {
			  return pactum
			  .spec()
			  .get('/relation/list_friend')
			  .withHeaders({
				   Authorization: `Bearer ${dummyJwt.access_token}`,
			   })
			  .expectStatus(200)
			  .expectBodyContains('')
			}); 

			it('remove a friend ' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: -21,
				})
				.expectStatus(403)
			});

			/* SHOULD DO A Function to see relation and do a test to see if relation got delete after unfriend
			it ('should have delete some relation')
			*/
		});

		describe('block_user', ()=>{
			it ('show list block user of dummy' ,() => {
				return pactum
				.spec()
				.get('/relation/list_block')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(200)
				.expectBody([])
			})

			it ('should block a user ', () => {
				return  pactum
				.spec()
				.post('/relation/block_user')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(201)
			})

			it ('should show user block in list', () => {
				return pactum
				.spec()
				.get('/relation/list_block')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectBodyContains([hugoUser])
			})

			it ('should do nothin, wrong bearer token', () => {
				return pactum
				.spec()
				.post('/relation/block_user')
				.withHeaders({
					Authorization:  `Bearer 3281321`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(401)
			}) 

			it ('should do nothin, wrong userId in body', () => {
				return pactum
				.spec()
				.post('/relation/block_user')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: 92312312,
				})
				.expectStatus(403)
			}) 
		})
		describe('Unblock User', () => {
			it ('shoudl unblock user', () => {
				return pactum
				.spec()
				.post('/relation/unblock_user')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(201)
			})

			it ('should have no more block user see test above', () => {
				return pactum
				.spec()
				.get('/relation/list_block')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectBody([])
				.expectStatus(200)
			})

			it ('should block, not true test', () => {
				return pactum
				.spec()
				.post('/relation/block_user')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(201)
			})

			it ('should fail, invalide bearer token', ()=> {
				return pactum 
				.spec()
				.post('/relation/unblock_user')
				.withHeaders({
					Authorization:  `Bearer 8234713`,
				})
				.withBody({
					userId: hugoUser.id,
				})
				.expectStatus(401)
			})


			it ('should fail, invalide body userid invalid', ()=> {
				return pactum 
				.spec()
				.post('/relation/unblock_user')
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					userId: -212121212,
				})
				.expectStatus(403)
			})



		})

});
