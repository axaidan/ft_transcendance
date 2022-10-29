import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Achievement, Channel, ChannelUser, Discussion, User } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionService } from 'src/chat/discussion/discussion.service';
import { UserService } from '../src/users/users.service';
import { AppModule } from '../src/app.module';
import { EditUserDto } from 'src/users/dto/edit-user.dto';
import { CreateDiscussionDto, DiscussionDto } from 'src/chat/discussion/dto';
import { CreateChannelDto } from 'src/chat/channel/dto';
import { EChannelRoles, EChannelStatus } from 'src/chat/channel/channel-user/types';
import { normalize } from 'path';
import { ChannelService } from 'src/chat/channel/channel.service';

const N = 20;

describe('App e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let authService: AuthService;
	let discService: DiscussionService;
	let chanService: ChannelService;
	
	let dummyJwt: {access_token: string};
	let dummyUser: User
	let kyleUser: User 
	let hugoUser: User
	let angelUser: User
	let userArr: User[] = [];
	let jwtArr: {access_token: string}[] = [];
	let discArr: Discussion[];
	let chanArr: Channel[];
	let chanUserArr: ChannelUser[];
	let achievArr: Achievement[];

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

	const seedChannels = async function() {
		const channelArr: Channel[] = [];
		let i = 0;
		for ( ; i < N/4 ; i++) {
			const channel = await chanService.create(userArr[0].id, {
				name: `channel${i}`,
				private: false,
				protected: false,
			});
			channelArr.push(channel);
		}
		for ( ; i < N/2 ; i++) {
			const channel = await chanService.create(userArr[2].id, {
				name: `channel${i}`,
				private: false,
				protected: true,
				hash: `password${i}`,

			});
			channelArr.push(channel);
		}
		for ( ; i < N/2 + N/4 ; i++) {

			const channel = await chanService.create(userArr[1].id, {
				name: `channel${i}`,
				private: true,
				protected: false,
			});

			channelArr.push(channel);
		}
		for ( ; i < N ; i++) {
			const channel = await chanService.create(userArr[3].id, {
				name: `channel${i}`,
				private: true,
				protected: true,
				hash: `password${i}`,
			});
			channelArr.push(channel);
		}
		return channelArr;
	}

	const seedChannelUsers = async function() {
		const channelUserArr: ChannelUser[] = [];
		//	CREATE 4 ChannelUsers IN chanArr[0]
		for (let i = 1 ; i < 5 ; i++) {
			const channelUser = await prisma.channelUser.create({
				data: {
					userId: userArr[i].id,
					channelId: chanArr[0].id,
					status: EChannelStatus.NORMAL,
					role: EChannelStatus.NORMAL,
				}
			});
			channelUserArr.push(channelUser);
		}
		await prisma.channelUser.create({
			data: {
				userId: dummyUser.id,
				channelId: chanArr[1].id,
				status: 0,
				role: 0,
			}
		})
		return channelUserArr;
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

	const seedAchievements = async function() {
		const arr: Achievement[] = [];
		const achiv0 = await prisma.achievement.upsert({
			where: {title: 'HelloWorld'},
			update: {}, 
			create: {
				title: 'HelloWorld',
				descriptions: 'You logged in for the first time!',
				path: 'fa-solid fa-earth-europe',
			},
		})

		const achiv1 = await prisma.achievement.upsert({
			where: {title: 'Birth of a Legend'},
			update: {}, 
			create: {
				title: 'Birth of a Legend',
				descriptions: 'You won your first game!',
				path: 'fa-solid fa-award',
			},
		})

		const achiv2 = await prisma.achievement.upsert({
			where: {title: 'Played 3 games'},
			update: {}, 
			create: {
				title: 'Played 3 games',
				descriptions: 'You played three games!',
				path: 'fa-solid fa-question',
			},
		})

		const achiv3 = await prisma.achievement.upsert({
			where: {title: 'Tiens, un curly!'},
			update: {}, 
			create: {
				title: 'Tiens, un curly!',
				descriptions: 'You added your first friend!',
				path: 'fa-solid fa-user-group',
			},
		})


		const achiv4 = await prisma.achievement.upsert({
			where: {title: 'U there, shut up!'},
			update: {}, 
			create: {
				title: 'U there, shut up!',
				descriptions: 'You blocked a user for the first time!',
				path: 'fa-solid fa-person-harassing',
			},
		})


		const achiv5 = await prisma.achievement.upsert({
			where: {title: 'Social Club is Open'},
			update: {}, 
			create: {
				title: 'Social Club is Open',
				descriptions: 'You joined your first Channel!',
				path: 'fa-solid fa-martini-glass-citrus',
			},
		})


		const achiv6 = await prisma.achievement.upsert({
			where: {title: 'Houston, do you read me?'},
			update: {}, 
			create: {
				title: 'Houston, do you read me?',
				descriptions: 'You sent your first private message!',
				path: 'fa-regular fa-envelope',
			},
		})


		const achiv7 = await prisma.achievement.upsert({
			where: {title: 'Custom Username!'},
			update: {}, 
			create: {
				title: 'Custom Username!',
				descriptions: 'You edited your username!',
				path: 'fa-solid fa-fingerprint',
			},
		})


		const achiv8 = await prisma.achievement.upsert({
			where: {title: 'Custom Master!'},
			update: {}, 
			create: {
				title: 'Custom Master!',
				descriptions: 'You uploaded a customized Avatar!',
				path: 'fa-solid fa-satellite-dish',
			},
		})


		const achiv9 = await prisma.achievement.upsert({
			where: {title: 'Here is my Kingdom!'},
			update: {}, 
			create: {
				title: 'Here is my Kingdom!',
				descriptions: 'You created a Channel!',
				path: 'fa-solid fa-podcast',
			},
		})


		const achiv10 = await prisma.achievement.upsert({
			where: {title: 'Ragnarok'},
			update: {}, 
			create: {
				title: 'Ragnarok',
				descriptions: 'You deleted a Channel!',
				path: 'fa-solid fa-explosion',
			},
		})

		const achiv11 = await prisma.achievement.upsert({
			where: {title: 'Platinum'},
			update: {}, 
			create: {
				title: 'Platinum',
				descriptions: 'You unlocked all Achievements!',
				path: 'fa-solid fa-trophy',
			},
		});
		arr.push(achiv1);
		arr.push(achiv2);
		arr.push(achiv3);
		arr.push(achiv4);
		arr.push(achiv5);
		arr.push(achiv6);
		arr.push(achiv7);
		arr.push(achiv8);
		arr.push(achiv9);
		arr.push(achiv10);
		arr.push(achiv11);
		return arr;
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
		chanService = app.get(ChannelService);
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
		// ACHIEVEMENT SEED
		achievArr = await seedAchievements();
		// CHANNEL SEED
		chanArr = await seedChannels();
		// CHANNELUSER SEED
		chanUserArr = await seedChannelUsers();


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
			username: 'LoveDummyDu93',
			twoFactorAuth: true,
		}

		it('VALID USERNAME, 2FA - should 200', () => {
			const dto = baseDto;
			return pactum
			.spec()
			.patch('/user')
			.withHeaders({
				Authorization: `Bearer ${dummyJwt.access_token}`,
			})
			.withBody(dto)
			.expectStatus(200)
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

		it('VALID USERNAME - should 200', () => {
			const {twoFactorAuth, ...dto} = baseDto;
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
			const {username, ...dto} = baseDto;
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

		it('EMPTY USERNAME - should 400', () => {
			const {twoFactorAuth, ...dto} = baseDto;
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
			const {twoFactorAuth, username, ...dto} = baseDto;
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

		describe('Create POST /discussion', () => {
			it('VALID - should 201', () => {
				const userId = userArr[6].id;
				const dto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(201)
				.expectBodyContains(userId)
				.expectBodyContains(dummyUser.id)
				// .inspect();
			});
// 
			it('NON VALID DTO- should 201', () => {
				const userId = userArr[0].id;
				const dto = {
					// user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(400)
				// .expectBodyContains(userId)
				// .expectBodyContains(dummyUser.id)
				// .inspect();
			});
// 
			it('NO DTO- should 400', () => {
				const userId = userArr[0].id;
				return pactum
				.spec()
				.post('/discussion')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				// .withBody(dto)
				.expectStatus(400)
				// .expectBodyContains(userId)
				// .expectBodyContains(dummyUser.id)
				// .inspect();
			});
// 
			it('NO JWT - should 401', () => {
				const userId = userArr[0].id;
				const dto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion')
				// .withHeaders({
				// 	Authorization: `Bearer ${dummyJwt.access_token}`,
				// })
				.withBody(dto)
				.expectStatus(401)
				// .inspect();
			});
			// 
			it('ALREADY EXISTS - should 403', () => {
				const userId = userArr[0].id;
				const dto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.post('/discussion')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(403)
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
				.expectJsonLength(6)
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

		// describe('Retrieve Msgs GET /discussion/user/:id', () => {
		// 	it('VALID - NO MSGS', () => {
		// 		return pactum
		// 		.spec()
		// 		.get(`/discussion/user/${dummyUser.id}`)
		// 		.withHeaders({
		// 			Authorization: `Bearer ${jwtArr[0].access_token}`,
		// 		})
		// 		.expectStatus(200)
		// 		// .inspect()
		// 	});

		// 	it('VALID - HAS MSGS', () => 
// import { GetUser } from 'src/auth/decorator';{
		// 		return pactum
		// 		.spec()
		// 		.get(`/discussion/user/${dummyUser.id}`)
		// 		.withHeaders({
		// 			Authorization: `Bearer ${jwtArr[1].access_token}`,
		// 		})
		// 		.expectStatus(200)
		// 		// .inspect()
		// 	});

			// NO WEBSOCKET ON TEST, TEST NOT POSSIBLE FOR NOW
			// it('VALID - NO CONV - should 200 EMPTY ARR', () => {
			// 	return pactum
			// 	.spec()
			// 	.get(`/discussion/user/${dummyUser.id}`)
			// 	.withHeaders({
			// 		Authorization: `Bearer ${jwtArr[10].access_token}`,
			// 	})
			// 	.expectStatus(200)
			// 	// .inspect()
			// });
		// }); // DESCRIBE (DISCUSSION/:ID)

		describe('GET  /discussion/:id', () => {
			it('VALID - should 201', () => {
				const userId = userArr[6].id;
				const dto = {
					user2Id: userId,
				};
				return pactum
				.spec()
				.get(`/discussion/${discArr[0].id}`)
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(200)
				.expectBodyContains(userArr[0].id)
				.expectBodyContains(userArr[1].id)
				// .inspect();
			});
		});


	});	// DESCRIBE(DISCUSSION)

	describe('Channel', () => {

		const dto : CreateChannelDto = {
			name: 'customChannel1',
			protected: false,
			private: false,
		};

		describe('Create POST /channel', () => {
			it('VALID public, not protected - should 201', () => {
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(201)
				.expectBodyContains(dto.name)
				.expectBodyContains(dto.protected)
				// .expectBodyContains(dummyUser.id)
				// .inspect();
			});

			it('ALREADY EXISTS - should 403', () => {
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(403)
				// .inspect();
			});

			it('NON VALID DTO - NO name -  should 400', () => {
				const noNameDto = {
					protected: false,
					private: false,
				};
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(noNameDto)
				.expectStatus(400)
				// .inspect();
			});

			it('NON VALID DTO - NO protected - should 400', () => {
				const noProtectedDto = {
					name: 'customChannel1',
					private: true,
				}
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(noProtectedDto)
				.expectStatus(400)
				// .inspect();
			});

			it('NON VALID DTO - NO private - should 400', () => {
				const noProtectedDto = {
					name: 'customChannel1',
					protected: false,
					hash: 'password',
				}
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(noProtectedDto)
				.expectStatus(400)
				// .inspect();
			});

			it('VALID - public protected should 201', () => {
				const protectedDto = {
					name: 'privCustomChannel',
					private: false,
					protected: true, 
					hash: 'password',
				}
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(protectedDto)
				.expectStatus(201)
				.expectBodyContains(protectedDto.name)
				.expectBodyContains(protectedDto.protected)
				// .expectBodyContains(protectedDto.hash)
				// .inspect();
			});

			it ('NON VALID - protected NO hash - should 400', () => {
				const noHashDto = {
					name: 'channel',
					private: false,
					protected: true, 
				}
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(noHashDto)
				.expectStatus(400)
				// .inspect();
			});

			it ('MALFORMED - non-protected + hash - should 200 with null hash', () => {
				const notProtWithHashDto  = {
					name: 'notProtWithHashchan',
					private: false,
					protected: false, 
					hash: 'password',
				}
				return pactum
				.spec()
				.post('/channel')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(notProtWithHashDto)
				.expectStatus(201)
				.expectBodyContains(notProtWithHashDto.name)
				.expectBodyContains(notProtWithHashDto.private)
				.expectBodyContains(notProtWithHashDto.protected)
				//	CANNOT TEST LIKE THIS => NEED createdAt, updatedAt, id
				// .expectBodyContains({
				// 	name: notProtWithHashDto.name,
				// 	hash: null,
				// 	private: notProtWithHashDto.private,
				// 	protected: notProtWithHashDto.protected,
				// })
				// .inspect();
			});

		});	// DESCRIBE(CREATE POST/channel)


		describe('GET /channel/all', () => {

			it('VALID - should 200', () => {
				return pactum
				.spec()
				.get('/channel/all')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody(dto)
				.expectStatus(200)
				.expectJsonLength(13)
				// .expectBodyContains(chanArr[0].name)
				// .expectBodyContains(chanArr[4].name)
				// .inspect();
			});

		}); //	DESCRIBE (GET/channel/all)

		describe('POST /channel/join', () => {

			it('VALID JOIN PUBLIC - should 201', () => {
				return pactum
				.spec()
				.post('/channel/join')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					id: chanArr[0].id,
				})
				.expectStatus(201)
				// .inspect();
			});

			it('VALID JOIN protected - should 201', () => {
				return pactum
				.spec()
				.post('/channel/join')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`,
				})
				.withBody({
					id: chanArr[5].id,
					hash: `password${5}`,
				})
				.expectStatus(201)
				// .inspect();
			});

			it('NON-VALID JOIN protected - should 403', () => {
				return pactum
				.spec()
				.post('/channel/join')
				.withHeaders({
					Authorization: `Bearer ${jwtArr[0].access_token}`,
				})
				.withBody({
					id: chanArr[5].id,
					hash: `incorrectPWD${5}`,
				})
				.expectStatus(403)
				// .inspect();
			});

			it('NO-hash JOIN protected - should 400', () => {
				return pactum
				.spec()
				.post('/channel/join')
				.withHeaders({
					Authorization: `Bearer ${jwtArr[0].access_token}`,
				})
				.withBody({
					id: chanArr[5].id,
					// hash: `incorrectPWD${5}`,
				})
				.expectStatus(400)
				// .inspect();
			});

		}); //	DESCRIBE (POST /channel/join)

		describe('POST /channel/leave', () => {

			it('VALID leave - should 200', () => {
				return pactum
				.spec()
				.post('/channel/leave')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`
				})
				.withBody({
					id: chanArr[0].id,
				})
				.expectStatus(200)
				// .inspect();
			});

			it('NOT MEMBER - should 403', () => {
				return pactum
				.spec()
				.post('/channel/leave')
				.withHeaders({
					Authorization: `Bearer ${dummyJwt.access_token}`
				})
				.withBody({
					id: chanArr[0].id,
				})
				.expectStatus(403)
				// .inspect();
			});

		});

		describe('GET /channel', () => {

			it('VALID - should 200', () => {
				return pactum
				.spec()
				.get('/channel')
				.withHeaders({
					Authorization: `Bearer ${jwtArr[0].access_token}`,
				})
				.expectStatus(200)
				// .inspect();
			});

		}); //	DESCRIBE (GET/channel/)

	});

	

}); // DESCRIBE(APP-E2E)
