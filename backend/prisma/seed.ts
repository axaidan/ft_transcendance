import { PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()


async function main() {
	
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