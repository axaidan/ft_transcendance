import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionService } from 'src/discussion/discussion.service';
import { UserService } from '../src/users/users.service';
import { AppModule } from '../src/app.module';
import { EditUserDto } from 'src/users/dto/edit-user.dto';
import { CreateDiscussionDto } from 'src/discussion/dto/index';

const N = 20;

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let authService: AuthService;
	let discService: DiscussionService;
	
	let dummyJwt: {access_token: string};
	let dummyUser: User
	let kyleUser: User 
	let hugoUser: User
	let angelUser: User
	let userArr: User[] = [];
	let jwtArr: {access_token: string}[] = [];

	const seedUsers = async function() {
		const name: string = "user";
		const userArr: User[] = [];

		for (let i = 0 ; i < N ; i++) {
			const login: string = name + `${i}`;
			const email: string = login + '@student.42.fr';
			const user: User = await prisma.user.create({
				data: {
					login: login,
					username: login,
					email: email,
				},
			});
			userArr.push(user);
		}
		return userArr;
	}

	const seedJwts = async function(users: User[]) : Promise<{access_token: string}[]>{
		const jwts: {access_token: string}[] = [];

		for (let i = 0 ; i < N ; i++) {
			const jwt = await authService.signToken(users[i].id, users[i].login);
			jwts.push(jwt);
		}
		return jwts;
	}

	const seedDiscussions = async function(users: User[]) {
	// FOR N === 20
	// dummyUser HAS 5 Discussion, 3 WHERE user1Id, 2 WHERE user2Id
	// user[0 - 9)] ALL HAVE DISCUSSIONS
	// user[10 - 19] HAVE NO DISCUSSION] has 2 discussion
		let i = 1;
		for ( ; i < 2 ; i++) {
			const discussion = await prisma.discussion.create({
				data: {
					user1Id: dummyUser.id, 
					user2Id: users[i].id,
				}
			});
		}
		for ( ; i < 5 ; i++) {
			await prisma.discussion.create({
				data: {
					user1Id: users[i].id,
					user2Id: dummyUser.id, 
				}
			});
		}
		for ( ; i < N / 2 ; i++) {
			await prisma.discussion.create({
				data: {
					user1Id: users[i].id,
					user2Id: users[i - 1].id
				}
			});
		}

	}

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
			username: 'dummy',
			email: 'dummy@student.42.fr',
			}
		}
		);

		// USER ARRAY SEED
		userArr = await seedUsers();
		// CURRENT USERS JWTs SEED
		jwtArr = await seedJwts(userArr)
		// DISCUSSIONS SEED
		seedDiscussions(userArr);

		dummyJwt = await authService.signToken(dummyUser.id, dummyUser.login);
		// SET baseUrl FOR PACTUM
		pactum.request.setBaseUrl('http://localhost:3333');
		// STORE JwtAccessToken IN PACTUM FOR REUSE- NOT WORKING
		// pactum.spec().stores('userAt', 'dummyJwt.access_token');

		// !!!!!!!!!!!!!!!!!!!!!
		// !!!!! UNCOMMENT !!!!!
		// function() {
		// // 	// const kyleUser = await prisma.user.create({
		// // 	// 	data: {
		// // 	// 		login: 'kyle',
		// // 	// 		email: 'kyle@student.42.fr'
		// // 	// 	}
		// // 	//   }
		// // 	// );
		
		// // 	// const hugoUser = await prisma.user.create({
		// // 	// 	data: {
		// // 	// 		login: 'hugo',
		// // 	// 		email: 'hugo@student.42.fr'
		// // 	// 	}
		// // 	//   }
		// // 	// );  
			
		// // 	// const angelUser = await prisma.user.create({
		// // 	// 	data: {
		// // 	// 		login: 'angel',
		// // 	// 		email: 'angel@student.42.fr'
		// // 	// 	}
		// // 	//   }
		// // 	// );




		// // 	// const achiv = await prisma.achievement.upsert({
		// // 	// 	where: {title: '10 in a raw'},
		// // 	// 	update: {}, 
		// // 	// 	create: {
		// // 	// 		title: '10 in a raw',
		// // 	// 		descriptions: 'you play 10 game in a raw',
		// // 	// 	},
		// // 	// })

		// // 	// const achiv1 = await prisma.achievement.upsert({
		// // 	// 	where: {title: 'login'},
		// // 	// 	update: {}, 
		// // 	// 	create: {
		// // 	// 		title: 'login',
		// // 	// 		descriptions: 'you log for the first time',
		// // 	// 	},
		// // 	// })

		// // 	// const achiv2 = await prisma.achievement.upsert({
		// // 	// 	where: {title: 'first win'},
		// // 	// 	update: {}, 
		// // 	// 	create: {
		// // 	// 		title: 'first win',
		// // 	// 		descriptions: 'gg well played',
		// // 	// 	},
		// // 	// })

		// // 	// const achiv3 = await prisma.achievement.upsert({
		// // 	// 	where: {title: 'un curly'},
		// // 	// 	update: {}, 
		// // 	// 	create: {
		// // 	// 		title: 'tiens un curly',
		// // 	// 		descriptions: 'tu as ajouter ton premier ami',
		// // 	// 	},
		// // 	// })

		// // 	// const game1 = await prisma.game.upsert({
		// // 	// 	where: {id:1},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 1,
		// // 	// 			score1: 2,
		// // 	// 			player2Id: 2,
		// // 	// 			score2: 3,
		// // 	// 	},
		// // 	// })

		// // 	// const game2 = await prisma.game.upsert({
		// // 	// 	where: {id:2},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 1,
		// // 	// 			score1: 2,
		// // 	// 			player2Id: 3,
		// // 	// 			score2: 3,
		// // 	// 	},
		// // 	// })

		// // 	// const game3 = await prisma.game.upsert({
		// // 	// 	where: {id:3},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 2,
		// // 	// 			score1: 2,
		// // 	// 			player2Id: 3,
		// // 	// 			score2: 3,
		// // 	// 	},
		// // 	// })

		// // 	// const game4 = await prisma.game.upsert({
		// // 	// 	where: {id:4},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 1,
		// // 	// 			score1: 3,
		// // 	// 			player2Id: 3,
		// // 	// 			score2: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const game5 = await prisma.game.upsert({
		// // 	// 	where: {id:5},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 2,
		// // 	// 			score1: 2,
		// // 	// 			player2Id: 3,
		// // 	// 			score2: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const game6 = await prisma.game.upsert({
		// // 	// 	where: {id:6},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 4,
		// // 	// 			score1: 3,
		// // 	// 			player2Id: 2,
		// // 	// 			score2: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const game7 = await prisma.game.upsert({
		// // 	// 	where: {id:7},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 			player1Id: 2,
		// // 	// 			score1: 1,
		// // 	// 			player2Id: 4,
		// // 	// 			score2: 3,
		// // 	// 	},
		// // 	// })

		// // 	// const friend1 = await prisma.relation.upsert({
		// // 	// 	where : {id: 1},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 1 ,
		// // 	// 		userIWatchId: 2,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const friend2 = await prisma.relation.upsert({
		// // 	// 	where : {id: 2},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 1 ,
		// // 	// 		userIWatchId: 3,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const friend3 = await prisma.relation.upsert({
		// // 	// 	where : {id: 3},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 1 ,
		// // 	// 		userIWatchId: 4,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const friend4 = await prisma.relation.upsert({
		// // 	// 	where : {id: 4},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 4 ,
		// // 	// 		userIWatchId: 1,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const friend5 = await prisma.relation.upsert({
		// // 	// 	where : {id: 5},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 4 ,
		// // 	// 		userIWatchId: 2,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const friend6 = await prisma.relation.upsert({
		// // 	// 	where : {id: 6},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 3 ,
		// // 	// 		userIWatchId: 4,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const friend7 = await prisma.relation.upsert({
		// // 	// 	where : {id: 7},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 3 ,
		// // 	// 		userIWatchId: 2,
		// // 	// 		relation: 1,
		// // 	// 	},
		// // 	// })

		// // 	// const block8 = await prisma.relation.upsert({
		// // 	// 	where : {id: 8},
		// // 	// 	update: {},
		// // 	// 	create: {
		// // 	// 		userId: 4 ,
		// // 	// 		userIWatchId: 3,
		// // 	// 		relation: 2,
		// // 	// 	},
		// // 	// })
		// }
		// !!!!!!!!!!!!!!!!!!!!!

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

		it('VALID EMAIL, USERNAME, 2FA - should 200', () => {
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

		it('WRONG JWT, VALID REQUEST- should 401', () => {
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

		it('NON VALID EMAIL, VALID REST - should 400', () => {
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

		it('VALID EMAIL ONLY - should 200', () => {
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

		it('VALID USERNAME - should 200', () => {
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

		it('VALID 2FA - should 200', () => {
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

		it('WRONG EMAIL - should 400', () => {
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

		it('EMPTY USERNAME - should 400', () => {
			const {twoFactorAuth, email, ...dto} = baseDto;
			dto.username = '';
			return pactum
			.spec()
			.patch('/user')
			.withHeaders({
			Authorization: `Bearer ${dummyJwt.access_token}`,
			})
			.withBody(dto)
			.expectStatus(400)
			.inspect();
			// .expectBodyContains('null');
		});

		it('EMPTY DTO - should 200', () => {
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
		
		it('VALID W/ EXTRA PROPERTY - should 200', () => {
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
	});	//	DESCRIBE(USER)

	describe('Relation', () => {
		describe('list_friend', () => {

			var list : User[] = [];
			list.push(kyleUser)
			list.push(hugoUser)
			list.push(angelUser)
			it('VALID USER - should list friend of current user', () => {
			return pactum
			.spec()
			.get('/relation/list_friend')
			.withHeaders({
				Authorization: `Bearer ${dummyJwt.access_token}`,
			})
			.expectStatus(200)
//			  .expectBodyContains()
//			  .inspect();
			});  

			it('Invalide user - should ret error', () => {
				return pactum
				.spec()
			.get('/relation/list_friend')
			.withHeaders({
				Authorization: `Bearer `,
			})
			.expectStatus(401)
			});

		}); // DESCRIBE(RELATION/LIST_FRIEND)

	});	//	DESCRIBE(RELATION)

	//here

		

	describe('Discussion', () => {

		describe('Create POST /discussion/create', () => {
			it('VALID - should 201', () => {
				const userId = userArr[0].id;
				const dto: CreateDiscussionDto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion/create')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(201)
				.expectBodyContains(userId)
				.expectBodyContains(dummyUser.id)
				// .inspect();
			});

			it('NON VALID DTO- should 201', () => {
				const userId = userArr[0].id;
				const dto = {
					// user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion/create')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(400)
				// .expectBodyContains(userId)
				// .expectBodyContains(dummyUser.id)
				.inspect();
			});

			it('NO DTO- should 201', () => {
				const userId = userArr[0].id;
				const dto = {
					// user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion/create')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				// .withBody(dto)
				.expectStatus(400)
				// .expectBodyContains(userId)
				// .expectBodyContains(dummyUser.id)
				.inspect();
			});

			it('NO JWT - should 401', () => {
				const userId = userArr[0].id;
				const dto: CreateDiscussionDto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion/create')
				// .withHeaders({
				// 	Authorization: `Bearer ${dummyJwt.access_token}`,
				// })
				.withBody(dto)
				.expectStatus(401)
				// .inspect();
			});
			
			it('ALREADY EXISTS - should 400', () => {
				const userId = userArr[0].id;
				const dto: CreateDiscussionDto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion/create')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(400)
				// .inspect();
			});
		});	// DESCRIBE(DISCUSSION/CREATE)


		describe('Retrieve GET /discussion/', () => {
		
			it('VALID - HAS DISCUSSIONS - should 200', () => {
				return pactum
				.spec()
				.get('/discussion')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(200)
				.expectBodyContains(dummyUser.id)
				// .expectBodyContains(dummyUser.username) !!! NOT EDITED
				.expectBodyContains(userArr[0].id)
				.expectBodyContains(userArr[0].username)
				.expectBodyContains(userArr[1].id)
				.expectBodyContains(userArr[1].username)
				.expectBodyContains(userArr[2].id)
				.expectBodyContains(userArr[2].username)
				.expectBodyContains(userArr[3].id)
				.expectBodyContains(userArr[3].username)
				.expectBodyContains(userArr[4].id)
				.expectBodyContains(userArr[4].username)
				.expectJsonLength(5)
				// .inspect();
			});

			it('VALID - HAS NO DISCUSSION - should 200', () => {
				return pactum
				.spec()
				.get('/discussion')
				.withHeaders({
					Authorization: `Bearer ${jwtArr[N / 2].access_token}`,
				})
				.expectStatus(200)
				.expectBodyContains([])
				.expectJsonLength(0)
				// .inspect();
			});
			
			it('NO JWT - should 401', () => {
				return pactum
				.spec()
				.get('/discussion')
				// .withHeaders({
				// 	Authorization: `Bearer ${jwtArr[N / 2].access_token}`,
				// })
				.expectStatus(401);
				// .inspect();
			});

			it('WRONG JWT - should 401', () => {
				return pactum
				.spec()
				.get('/discussion')
				.withHeaders({
					Authorization: `Bearer blablabla`,
				})
				.expectStatus(401);
				// .inspect();
			});

		});	// DESCRIBE (DISCUSSION/RETRIEVE)

	});	// DESCRIBE(DISCUSSION)

}); // DESCRIBE(APP-E2E)