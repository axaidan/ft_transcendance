import { PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()


async function main() {
	
	const publicAvatarAxel = await prisma.avatar.upsert({
		where: {url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665425792/vbxxdzbgzoixomwrdxrr.jpg'},
		update: {},
		create: {
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665425792/vbxxdzbgzoixomwrdxrr.jpg',
			is_public: true,
		}
	}) 
	
	const publicAvatarMlormois = await prisma.avatar.upsert({
		where: {url: 'http://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg'},
		update: {},
		create: {
			is_public: true,
			url: 'http://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg'
		}
	}) 
	
	const publicAvatarvictor= await prisma.avatar.upsert({
		where: {url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429927/qgpd7mhqavtsjcok8euj.jpg'},
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429927/qgpd7mhqavtsjcok8euj.jpg'
		}
	}) 
		
	const publicAvatarSmile= await prisma.avatar.upsert({
		where: {url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429892/btflycu1uiba5bmxte17.jpg'},
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665429892/btflycu1uiba5bmxte17.jpg'
		}
	}) 
	
		
	const publicAvatarFurry= await prisma.avatar.upsert({
		where: {url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg'},
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665427593/cfkfccmyazzhmuqgazr4.jpg'
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
		where: {login: 'mlormois'}, 
		update: {},
		create: {
			login: 'mlormois',
			username: 'lmasturbator',
		},
	}) 

	const Axel = await prisma.user.upsert({
		where: {login: 'axaidan'}, 
		update: {},
		create: {
			login: 'axaidan',
			username: 'skusku',
		},
	}) 

	const Catino = await prisma.user.upsert({
		where: {login: 'fcatinau'},
		update: {},
		create: {
			login: 'fcatinau',
			username: 'ouinouin',
		},
	})

	const viporten = await prisma.user.upsert({
		where: {login: 'viporten'},
		update:{},
		create:{
			login: 'viporten',
			username: 'el beaugausse',
		},
	})

	const wluong = await prisma.user.upsert({
		where: {login: 'wluong'},
		update:{},
		create:{
			login: 'wluong',
			username: 'le chinois',
		},
	})

	const rmechety = await prisma.user.upsert({
		where: {login: 'rmechety'},
		update:{},
		create:{
			login: 'rmechety',
			username: 'Magreb Warrior',
		},
	})

	const lchristo = await prisma.user.upsert({
		where: {login: 'lchristo'},
		update:{},
		create:{
			login: 'lchristo',
			username: 'M.Muscle',
		},
	})

	const riblanc = await prisma.user.upsert({
		where: {login: 'riblanc'},
		update:{},
		create:{
			login: 'riblanc',
			username: 'StaffNewGen',
		},
	})

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
				player1Id: 1,
				score1: 2,
				player2Id: 2,
				score2: 3,
		},
	})

	const game2 = await prisma.game.upsert({
		where: {id:2},
		update: {},
		create: {
				player1Id: 1,
				score1: 2,
				player2Id: 3,
				score2: 3,
		},
	})

	const game3 = await prisma.game.upsert({
		where: {id:3},
		update: {},
		create: {
				player1Id: 2,
				score1: 2,
				player2Id: 3,
				score2: 3,
		},
	})

	const game4 = await prisma.game.upsert({
		where: {id:4},
		update: {},
		create: {
				player1Id: 1,
				score1: 3,
				player2Id: 3,
				score2: 1,
		},
	})

	const game5 = await prisma.game.upsert({
		where: {id:5},
		update: {},
		create: {
				player1Id: 2,
				score1: 2,
				player2Id: 3,
				score2: 1,
		},
	})

	const game6 = await prisma.game.upsert({
		where: {id:6},
		update: {},
		create: {
				player1Id: 4,
				score1: 3,
				player2Id: 2,
				score2: 1,
		},
	})

	const game7 = await prisma.game.upsert({
		where: {id:7},
		update: {},
		create: {
				player1Id: 2,
				score1: 1,
				player2Id: 4,
				score2: 3,
		},
	})

	const friend1 = await prisma.relation.upsert({
		where : {id: 1},
		update: {},
		create: {
			userId: 1 ,
			userIWatchId: 2,
			relation: 1,
		},
	})

	const friend2 = await prisma.relation.upsert({
		where : {id: 2},
		update: {},
		create: {
			userId: 1 ,
			userIWatchId: 3,
			relation: 1,
		},
	})

	const friend3 = await prisma.relation.upsert({
		where : {id: 3},
		update: {},
		create: {
			userId: 1 ,
			userIWatchId: 4,
			relation: 1,
		},
	})

	const friend4 = await prisma.relation.upsert({
		where : {id: 4},
		update: {},
		create: {
			userId: 4 ,
			userIWatchId: 1,
			relation: 1,
		},
	})

	const friend5 = await prisma.relation.upsert({
		where : {id: 5},
		update: {},
		create: {
			userId: 4 ,
			userIWatchId: 2,
			relation: 1,
		},
	})

	const friend6 = await prisma.relation.upsert({
		where : {id: 6},
		update: {},
		create: {
			userId: 3 ,
			userIWatchId: 4,
			relation: 1,
		},
	})

	const friend7 = await prisma.relation.upsert({
		where : {id: 7},
		update: {},
		create: {
			userId: 3 ,
			userIWatchId: 4,
			relation: 2,
		},
	})







	const block8 = await prisma.relation.upsert({
		where : {id: 8},
		update: {},
		create: {
			userId: 4 ,
			userIWatchId: 3,
			relation: 2,
		},
	})




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