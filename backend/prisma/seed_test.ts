import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


async function main() {


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
		where: { title: 'un curly' },
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


	const achiv5 = await prisma.achievement.upsert({
		where: { title: 'social club is open' },
		update: {},
		create: {
			title: 'social club is open',
			descriptions: 'tu as rejoins une groupe',
			path: 'fa-solid fa-martini-glass-citrus',
		},
	})


	const achiv6 = await prisma.achievement.upsert({
		where: { title: 'huston do you ear me' },
		update: {},
		create: {
			title: 'huston do you ear me',
			descriptions: 'tu as envoyer ton premier message',
			path: 'fa-regular fa-envelope',
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

	const achiv11 = await prisma.achievement.upsert({
		where: { title: 'platine' },
		update: {},
		create: {
			title: 'platine',
			descriptions: 'all success unlock',
			path: 'fa-solid fa-trophy',
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
