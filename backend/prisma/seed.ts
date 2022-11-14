import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


async function main() {

	const publicAvatarAxel = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460309/gt098zh9hypub4sludzg.jpg' },
		update: {},
		create: {
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460309/gt098zh9hypub4sludzg.jpg',
			is_public: true,
			public_id: 'gt098zh9hypub4sludzg',
		}
	})

	const publicAvatarMlormois = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460297/pzp0gatlbhud7letu8fo.jpg' },
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460297/pzp0gatlbhud7letu8fo.jpg',
			public_id: 'pzp0gatlbhud7letu8fo',
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
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460284/inpixjrh8urpztsdlsdm.jpg' },
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460284/inpixjrh8urpztsdlsdm.jpg',
			public_id: 'inpixjrh8urpztsdlsdm',
		}
	})


	const publicAvatarFurry = await prisma.avatar.upsert({
		where: { url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460272/r6wwdmfhetze6evalr4h.jpg' },
		update: {},
		create: {
			is_public: true,
			url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1668460272/r6wwdmfhetze6evalr4h.jpg',
			public_id: 'r6wwdmfhetze6evalr4h',
		}
	})

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