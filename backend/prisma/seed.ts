import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


async function main() {

	const publicAvatarAxel = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665425792/vbxxdzbgzoixomwrdxrr.jpg' },
		update: {},
		create: {
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665425792/vbxxdzbgzoixomwrdxrr.jpg',
			is_public: true,
			public_id: 'vbxxdzbgzoixomwrdxrr',
		}
	})

	const publicAvatarMlormois = await prisma.avatar.upsert({
		where: { url: 'http://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg' },
		update: {},
		create: {
			is_public: true,
			url: 'http://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg',
			public_id: 'cfkfccmyazzhmuqgazr4',
		}
	})

	const AvatarVictor = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429927/qgpd7mhqavtsjcok8euj.jpg' },
		update: {},
		create: {
			is_public: false,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429927/qgpd7mhqavtsjcok8euj.jpg',
			public_id: 'qgpd7mhqavtsjcok8euj',
		}
	})

	const publicAvatarSmile = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429892/btflycu1uiba5bmxte17.jpg' },
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429892/btflycu1uiba5bmxte17.jpg',
			public_id: 'btflycu1uiba5bmxte17',
		}
	})


	const publicAvatarFurry = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg' },
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg',
			public_id: 'cfkfccmyazzhmuqgazr4',
		}
	})


	/*
		const publicAvatar2 = await prisma.avatar.upsert({
			where: {url: ''},
			update: {},
			create: {
				is_pubic: true,
				url: ''
			}
		}) 
	
		*/


	const sergent = await prisma.user.upsert({
		where: { login: 'mlormois' },
		update: {},
		create: {
			login: 'mlormois',
			username: 'Sergent',
			avatarUrl: publicAvatarMlormois.url,
			ranking: 1500,

		},
	})

	const Axel = await prisma.user.upsert({
		where: { login: 'axaidan' },
		update: {},
		create: {
			login: 'axaidan',
			username: 'skusku',
			avatarUrl: publicAvatarAxel.url,
			ranking: 1500,
		},
	})

	const Catino = await prisma.user.upsert({
		where: { login: 'fcatinau' },
		update: {},
		create: {
			login: 'fcatinau',
			username: 'ouinouin',
			avatarUrl: publicAvatarFurry.url,
			ranking: 1500,
		},
	})

	const viporten = await prisma.user.upsert({
		where: { login: 'viporten' },
		update: {},
		create: {
			login: 'viporten',
			username: 'el beaugausse',
			avatarUrl: AvatarVictor.url,
			ranking: 1500,
		},
	})

	const wluong = await prisma.user.upsert({
		where: { login: 'wluong' },
		update: {},
		create: {
			login: 'wluong',
			avatarUrl: publicAvatarSmile.url,
			email: 'wluong@student.42.fr',
			ranking: 1500,
		},
	})

	const rmechety = await prisma.user.upsert({
		where: { login: 'rmechety' },
		update: {},
		create: {
			login: 'rmechety',
			username: 'Magreb Warrior',
			avatarUrl: publicAvatarFurry.url,
			ranking: 1500,
		},
	})

	const lchristo = await prisma.user.upsert({
		where: { login: 'lchristo' },
		update: {},
		create: {
			login: 'lchristo',
			username: 'M.Muscle',
			avatarUrl: publicAvatarSmile.url,
			ranking: 1500,
		},
	})

	const riblanc = await prisma.user.upsert({
		where: { login: 'riblanc' },
		update: {},
		create: {
			login: 'riblanc',
			username: 'StaffNewGen',
			avatarUrl: publicAvatarSmile.url,
			ranking: 1500,
		},
	})

	const achiv0 = await prisma.achievement.upsert({
		where: { title: 'HelloWorld' },
		update: {},
		create: {
			title: 'HelloWorld',
			descriptions: 'you login for the first time',
			path: 'fa-solid fa-earth-europe',
		},
	})

	const achiv1 = await prisma.achievement.upsert({
		where: { title: 'begin of a legend' },
		update: {},
		create: {
			title: 'begin of a legend',
			descriptions: 'you win your first game',
			path: 'fa-solid fa-award',
		},
	})

	const achiv2 = await prisma.achievement.upsert({
		where: { title: 'play 3 game' },
		update: {},
		create: {
			title: 'play 3 game',
			descriptions: 'do you realy like the game?',
			path: 'fa-solid fa-question',
		},
	})

	const achiv3 = await prisma.achievement.upsert({
		where: { title: 'tiens un curly' },
		update: {},
		create: {
			title: 'tiens un curly',
			descriptions: 'tu as ajouter ton premier ami',
			path: 'fa-solid fa-user-group',
		},
	})


	const achiv4 = await prisma.achievement.upsert({
		where: { title: 'U there, shutup!' },
		update: {},
		create: {
			title: 'U there, shutup!',
			descriptions: 'you block a user',
			path: 'fa-solid fa-person-harassing',
		},
	})


	// const achiv5 = await prisma.achievement.upsert({
	// 	where: { title: 'social club is open' },
	// 	update: {},
	// 	create: {
	// 		title: 'social club is open',
	// 		descriptions: 'tu as rejoins une groupe',
	// 		path: 'fa-solid fa-martini-glass-citrus',
	// 	},
	// })


	// const achiv6 = await prisma.achievement.upsert({
	// 	where: { title: 'huston do you ear me' },
	// 	update: {},
	// 	create: {
	// 		title: 'huston do you ear me',
	// 		descriptions: 'tu as envoyer ton premier message',
	// 		path: 'fa-regular fa-envelope',
	// 	},
	// })


	const achiv7 = await prisma.achievement.upsert({
		where: { title: 'you have chose your name' },
		update: {},
		create: {
			title: 'you have chose your name',
			descriptions: 'add a speudo',
			path: 'fa-solid fa-fingerprint',
		},
	})


	const achiv8 = await prisma.achievement.upsert({
		where: { title: 'custom master' },
		update: {},
		create: {
			title: 'custom master',
			descriptions: 'download a avatar',
			path: 'fa-solid fa-satellite-dish',
		},
	})


	const achiv9 = await prisma.achievement.upsert({
		where: { title: 'here is my kingdom' },
		update: {},
		create: {
			title: 'here is my kingdom',
			descriptions: 'creer un chanel',
			path: 'fa-solid fa-podcast',
		},
	})


	const achiv10 = await prisma.achievement.upsert({
		where: { title: 'ragnarok' },
		update: {},
		create: {
			title: 'ragnarok',
			descriptions: 'delete un chanel',
			path: 'fa-solid fa-explosion',
		},
	})

	const achiv11 = await prisma.achievement.upsert({
		where: { title: 'platine' },
		update: {},
		create: {
			title: 'platine',
			descriptions: 'all success unlock',
			path: 'fa-solid fa-trophy',
		},
	})


	const game1 = await prisma.game.upsert({
		where: { id: 1 },
		update: {},
		create: {
			player1Id: 1,
			score1: 2,
			player2Id: 2,
			score2: 3,
		},
	})

	const game2 = await prisma.game.upsert({
		where: { id: 2 },
		update: {},
		create: {
			player1Id: 1,
			score1: 2,
			player2Id: 3,
			score2: 3,
		},
	})

	const game3 = await prisma.game.upsert({
		where: { id: 3 },
		update: {},
		create: {
			player1Id: 2,
			score1: 2,
			player2Id: 3,
			score2: 3,
		},
	})

	const game4 = await prisma.game.upsert({
		where: { id: 4 },
		update: {},
		create: {
			player1Id: 1,
			score1: 3,
			player2Id: 3,
			score2: 1,
		},
	})

	const game5 = await prisma.game.upsert({
		where: { id: 5 },
		update: {},
		create: {
			player1Id: 2,
			score1: 2,
			player2Id: 3,
			score2: 1,
		},
	})

	const game6 = await prisma.game.upsert({
		where: { id: 6 },
		update: {},
		create: {
			player1Id: 4,
			score1: 3,
			player2Id: 2,
			score2: 1,
		},
	})

	const game7 = await prisma.game.upsert({
		where: { id: 7 },
		update: {},
		create: {
			player1Id: 2,
			score1: 1,
			player2Id: 4,
			score2: 3,
		},
	})

	const friend1 = await prisma.relation.upsert({
		where: { id: 1 },
		update: {},
		create: {
			userId: 1,
			userIWatchId: 2,
			relation: 1,
		},
	})

	const friend2 = await prisma.relation.upsert({
		where: { id: 2 },
		update: {},
		create: {
			userId: 1,
			userIWatchId: 3,
			relation: 1,
		},
	})

	const friend3 = await prisma.relation.upsert({
		where: { id: 3 },
		update: {},
		create: {
			userId: 5,
			userIWatchId: 4,
			relation: 1,
		},
	})

	const friend4 = await prisma.relation.upsert({
		where: { id: 4 },
		update: {},
		create: {
			userId: 4,
			userIWatchId: 1,
			relation: 1,
		},
	})

	const friend5 = await prisma.relation.upsert({
		where: { id: 5 },
		update: {},
		create: {
			userId: 4,
			userIWatchId: 2,
			relation: 1,
		},
	})

	const friend6 = await prisma.relation.upsert({
		where: { id: 6 },
		update: {},
		create: {
			userId: 3,
			userIWatchId: 4,
			relation: 1,
		},
	})

	const friend7 = await prisma.relation.upsert({
		where: { id: 7 },
		update: {},
		create: {
			userId: 3,
			userIWatchId: 4,
			relation: 2,
		},
	})







	const block8 = await prisma.relation.upsert({
		where: { id: 8 },
		update: {},
		create: {
			userId: 4,
			userIWatchId: 3,
			relation: 2,
		},
	})



	//	FAKE USERS SEED

	for (let i = 0; i < 10; i++) {
		await prisma.user.upsert({
			where: { login: `user${i}` },
			update: {},
			create: {
				login: `user${i}`,
				username: `USERNAME${i}`,
				email: `user${i}@student.42.fr`,
				twoFactorAuth: false,
				avatarUrl: publicAvatarSmile.url,
				ranking: 1000,
			}
		});
	}


	// --------------------------- //
	//      RELATIONS SEED         //
	// --------------------------- //

	/*
	
		for (let i = 0; i < 10; i++) {
			// FRIENDS OF mlormois
			await prisma.relation.create({
				data: {
					userId: 1,
					userIWatchId: 9 + i,
					relation: 1,
				}
			});
			// FRIENDS OF Axaidan
			await prisma.relation.create({
				data: {
					userId: 2,
					userIWatchId: 9 + i,
					relation: 1,
				}
			});
			if ( i != 8 ) {
				await prisma.relation.create({
					data: {
						userId: 9,
						userIWatchId: i + 1,
						relation: 1,
					}
				});
			}
		}
		*/

	// --------------------------- //
	//     DISCUSSION SEED         //
	// --------------------------- //

	// mlormois - user0
	// const discMax = []
	// for (let i = 9; i < 13; i++) {
	// 	discMax[i - 9] = await prisma.discussion.create({
	// 		data: {
	// 			user1Id: 1,
	// 			user2Id: i,
	// 		}
	// 	})
	// };

	// const discU0 = []
	// for (let i = 1; i < 9; i++) {
	// 	discU0[i - 9] = await prisma.discussion.create({
	// 		data: {
	// 			user1Id: 9,
	// 			user2Id: i,
	// 		}
	// 	})
	// };

	// // axaidan - user0
	// const disc2 = await prisma.discussion.create({
	// 	data: {
	// 		user1Id: 2,
	// 		user2Id: 9,
	// 	}
	// });
	// // viporten - user0
	// await prisma.discussion.create({
	// 	data: {
	// 		user1Id: 4,
	// 		user2Id: 9,
	// 	}
	// });

	// DISCUSSIONMESSAGES SEED
	// user0 => mlormois MESSAGES
	// for (let j = 0; j < 5; j++) {
	// 	for (let i = 0; i < 5; i++) {
	// 		await prisma.discussionMessage.create({
	// 			data: {
	// 				userId: discMax[j].user2Id,
	// 				discussionId: discMax[j].id,
	// 				text: "user" + discMax[j].user2Id + "msg" + i,
	// 			}
	// 		});
	// 		await prisma.discussionMessage.create({
	// 			data: {
	// 				userId: sergent.id,
	// 				discussionId: discMax[j].id,
	// 				text: "mlormois msg" + i,
	// 			}
	// 		});
	// 	}
	// }

	// user0 => axaidan MESSAGES
	// for (let i = 0; i < 5; i++) {
	// 	await prisma.discussionMessage.create({
	// 		data: {
	// 			userId: 9,
	// 			discussionId: disc2.id,
	// 			text: "user0 msg" + i,
	// 		}
	// 	});
	// }
	// // axaidan => user0 MESSAGES
	// for (let i = 0; i < 5; i++) {
	// 	await prisma.discussionMessage.create({
	// 		data: {
	// 			userId: Axel.id,
	// 			discussionId: disc2.id,
	// 			text: "axaidan msg" + i,
	// 		}
	// 	});
	// }
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit()
	})