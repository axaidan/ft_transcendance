import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Discussion, User } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionService } from 'src/discussion/discussion.service';
import { UserService } from '../src/users/users.service';
import { AppModule } from '../src/app.module';
import { EditUserDto } from 'src/users/dto/edit-user.dto';

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
	let discArr: Discussion[];

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
		let i = 0;
		let arr: Discussion[] = [];
		let disc: Discussion;
		for ( ; i < 2 ; i++) {
			disc = await prisma.discussion.create({
				data: {
					user1Id: dummyUser.id, 
					user2Id: users[i].id,
				}
			});
			arr.push(disc);
		}
		for ( ; i < 5 ; i++) {
			disc = await prisma.discussion.create({
				data: {
					user1Id: users[i].id,
					user2Id: dummyUser.id, 
				}
			});
			arr.push(disc);
		}
		for ( ; i < N / 2 ; i++) {
			disc = await prisma.discussion.create({
				data: {
					user1Id: users[i].id,
					user2Id: users[i - 1].id
				}
			});
			arr.push(disc);
		}
		return arr;
	}

	const seedDiscussionMessages = async function(users: User[]) {
		// 5 MESSAGES dummyUser => user0
		for (let i = 0 ; i < 5 ; i++) {
			await prisma.discussionMessage.create({
				data: {
					userId: dummyUser.id,
					discussionId: discArr[0].id,
					text: "message from dummy " + i,
				}
			});
		}
		for (let i = 0 ; i < 5 ; i++) {
			await prisma.discussionMessage.create({
				data: {
					userId: userArr[1].id,
					discussionId: discArr[0].id,
					text: "message from user1 " + i,
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
		});

		// USER ARRAY SEED
		userArr = await seedUsers();
		// CURRENT USERS JWTs SEED
		jwtArr = await seedJwts(userArr)
		// DISCUSSIONS SEED
		discArr = await seedDiscussions(userArr);
		// DISCUSSION MESSAGES SEED
		seedDiscussionMessages(userArr);

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
	
	const achiv0 = await prisma.achievement.upsert({
		where: {title: 'HelloWorld'},
		update: {}, 
		create: {
			title: 'HelloWorld',
			descriptions: 'you login for the first time',
			path: 'fa-solid fa-earth-europe',
		},
	})

	const achiv1 = await prisma.achievement.upsert({
		where: {title: 'begin of a legend'},
		update: {}, 
		create: {
			title: 'begin of a legend',
			descriptions: 'you win your first game',
			path: 'fa-solid fa-award',
		},
	})

	const achiv2 = await prisma.achievement.upsert({
		where: {title: 'play 3 game'},
		update: {}, 
		create: {
			title: 'play 3 game',
			descriptions: 'do you realy like the game?',
			path: 'fa-solid fa-question',
		},
	})

	const achiv3 = await prisma.achievement.upsert({
		where: {title: 'un curly'},
		update: {}, 
		create: {
			title: 'tiens un curly',
			descriptions: 'tu as ajouter ton premier ami',
			path: 'fa-solid fa-user-group',
		},
	})


	const achiv4 = await prisma.achievement.upsert({
		where: {title: 'U there, shutup!'},
		update: {}, 
		create: {
			title: 'U there, shutup!',
			descriptions: 'you block a user',
			path: 'fa-solid fa-person-harassing',
		},
	})


	const achiv5 = await prisma.achievement.upsert({
		where: {title: 'social club is open'},
		update: {}, 
		create: {
			title: 'social club is open',
			descriptions: 'tu as rejoins une groupe',
			path: 'fa-solid fa-martini-glass-citrus',
		},
	})


	const achiv6 = await prisma.achievement.upsert({
		where: {title: 'huston do you ear me'},
		update: {}, 
		create: {
			title: 'huston do you ear me',
			descriptions: 'tu as envoyer ton premier message',
			path: 'fa-regular fa-envelope',
		},
	})


	const achiv7 = await prisma.achievement.upsert({
		where: {title: 'you have chose your name'},
		update: {}, 
		create: {
			title: 'you have chose your name',
			descriptions: 'add a speudo',
			path: 'fa-solid fa-fingerprint',
		},
	})


	const achiv8 = await prisma.achievement.upsert({
		where: {title: 'custom master'},
		update: {}, 
		create: {
			title: 'custom master',
			descriptions: 'download a avatar',
			path: 'fa-solid fa-satellite-dish',
		},
	})


	const achiv9 = await prisma.achievement.upsert({
		where: {title: 'here is my kingdom'},
		update: {}, 
		create: {
			title: 'here is my kingdom',
			descriptions: 'creer un chanel',
			path: 'fa-solid fa-podcast',
		},
	})


	const achiv10 = await prisma.achievement.upsert({
		where: {title: 'ragnarok'},
		update: {}, 
		create: {
			title: 'ragnarok',
			descriptions: 'delete un chanel',
			path: 'fa-solid fa-explosion',
		},
	})

	const achiv11 = await prisma.achievement.upsert({
		where: {title: 'platine'},
		update: {}, 
		create: {
			title: 'platine',
			descriptions: 'all success unlock',
			path: 'fa-solid fa-trophy',
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
			// .inspect();
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

	
		describe('add_user', () => {
			it('Should do nothing, already friend with user I try to add', () => {
				return pactum
				.spec()
				.post('/relation/add_friend/' + hugoUser.id)
				.withHeaders({
					Authorization: `Bearer ${(dummyJwt.access_token)}`,
				})
				.expectStatus(201)
			});
			it('Should throw forbidden exception, userId invalid', () => {
				return pactum
				.spec()
				.post('/relation/add_friend/' + -2131)
				.withHeaders({
					Authorization: `Bearer ${(dummyJwt.access_token)}`,
				})
				.expectStatus(403);
			});


			it('Should do Error, bad bearer token', () => {
				return pactum
				.spec()
				.post('/relation/add_friend/' + hugoUser.id)
				.withHeaders({
					Authorization: `Bearer `,
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
				.post('/relation/remove_friend/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(201)
			});

			it('Should do nothing, bad Bearer token' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer 3r2qe432`,
				})
				.expectStatus(401)
			});
	
			it('Should do nothing, bad userId', () => {
				return pactum
				.spec()
				.post('/relation/remove_friend/' + 938293812389123891)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
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
				.post('/relation/remove_friend/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
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

			it('remove a friend kyleUser' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend/' + kyleUser.id)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(201)
			});

			it('remove a friend angelUser' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend/' + angelUser.id)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
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
			  .expectBody([])
			}); 

			it('remove a friend ' , () => {
				return pactum
				.spec()
				.post('/relation/remove_friend/' + -32312)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
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
				.post('/relation/block_user/' + hugoUser.id) 
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
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
				.post('/relation/block_user/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer 3281321`,
				})
				.expectStatus(401)
			}) 

			it ('should do nothin, wrong userId in body', () => {
				return pactum
				.spec()
				.post('/relation/block_user/' + 38193829)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(403)
			}) 
		})
		describe('Unblock User', () => {
			it ('shoudl unblock user', () => {
				return pactum
				.spec()
				.post('/relation/unblock_user/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
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
				.post('/relation/block_user/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(201)
			})

			it ('should fail, invalide bearer token', ()=> {
				return pactum 
				.spec()
				.post('/relation/unblock_user/' + hugoUser.id)
				.withHeaders({
					Authorization:  `Bearer 8234713`,
				})
				.expectStatus(401)
			})

			it ('should fail, invalide body userid invalid', ()=> {
				return pactum 
				.spec()
				.post('/relation/unblock_user/' + 32134)
				.withHeaders({
					Authorization:  `Bearer ${dummyJwt.access_token}`,
				})
				.expectStatus(403)
			})
		})
	});

		

	describe('Discussion', () => {

		// describe('Create POST /discussion/create', () => {
		// 	it('VALID - should 201', () => {
		// 		const userId = userArr[0].id;
		// 		const dto: DiscussionDto = {
		// 			user2Id: userId,
		// 		};
		// 		return pactum
		// 		.spec()
		// 		.post('/discussion/create')
		// 		.withHeaders({
		// 			Authorization: `Bearer ${dummyJwt.access_token}`,
		// 		})
		// 		.withBody(dto)
		// 		.expectStatus(201)
		// 		.expectBodyContains(userId)
		// 		.expectBodyContains(dummyUser.id)
		// 		// .inspect();
		// 	});

		// 	it('NON VALID DTO- should 201', () => {
		// 		const userId = userArr[0].id;
		// 		const dto = {
		// 			// user2Id: userId,
		// 		};
		// 		return pactum
		// 		.spec()
		// 		.post('/discussion/create')
		// 		.withHeaders({
		// 			Authorization: `Bearer ${dummyJwt.access_token}`,
		// 		})
		// 		.withBody(dto)
		// 		.expectStatus(400)
		// 		// .expectBodyContains(userId)
		// 		// .expectBodyContains(dummyUser.id)
		// 		.inspect();
		// 	});

		// 	it('NO DTO- should 201', () => {
		// 		const userId = userArr[0].id;
		// 		const dto = {
		// 			// user2Id: userId,
		// 		};
		// 		return pactum
		// 		.spec()
		// 		.post('/discussion/create')
		// 		.withHeaders({
		// 			Authorization: `Bearer ${dummyJwt.access_token}`,
		// 		})
		// 		// .withBody(dto)
		// 		.expectStatus(400)
		// 		// .expectBodyContains(userId)
		// 		// .expectBodyContains(dummyUser.id)
		// 		.inspect();
		// 	});

		// 	it('NO JWT - should 401', () => {
		// 		const userId = userArr[0].id;
		// 		const dto: DiscussionDto = {
		// 			user2Id: userId,
		// 		};
		// 		return pactum
		// 		.spec()
		// 		.post('/discussion/create')
		// 		// .withHeaders({
		// 		// 	Authorization: `Bearer ${dummyJwt.access_token}`,
		// 		// })
		// 		.withBody(dto)
		// 		.expectStatus(401)
		// 		// .inspect();
		// 	});
			
		// 	it('ALREADY EXISTS - should 400', () => {
		// 		const userId = userArr[0].id;
		// 		const dto: DiscussionDto = {
		// 			user2Id: userId,
		// 		};
		// 		return pactum
		// 		.spec()
		// 		.post('/discussion/create')
		// 		.withHeaders({
		// 			Authorization: `Bearer ${dummyJwt.access_token}`,
		// 		})
		// 		.withBody(dto)
		// 		.expectStatus(400)
		// 		// .inspect();
		// 	});
		// });	// DESCRIBE(DISCUSSION/CREATE)


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

		describe('Retrieve Msgs GET /discussion/user/:id', () => {
			it('VALID - NO MSGS', () => {
				return pactum
				.spec()
				.get(`/discussion/user/${dummyUser.id}`)
				.withHeaders({
					Authorization: `Bearer ${jwtArr[0].access_token}`,
				})
				.expectStatus(200)
				// .inspect()
			});

			it('VALID - HAS MSGS', () => {
				return pactum
				.spec()
				.get(`/discussion/user/${dummyUser.id}`)
				.withHeaders({
					Authorization: `Bearer ${jwtArr[1].access_token}`,
				})
				.expectStatus(200)
				// .inspect()
			});

			it('VALID - NO CONV - should 200 EMPTY ARR', () => {
				return pactum
				.spec()
				.get(`/discussion/user/${dummyUser.id}`)
				.withHeaders({
					Authorization: `Bearer ${jwtArr[10].access_token}`,
				})
				.expectStatus(200)
				// .inspect()
			});
		}); // DESCRIBE (DISCUSSION/:ID)



	});	// DESCRIBE(DISCUSSION)

}); // DESCRIBE(APP-E2E)
