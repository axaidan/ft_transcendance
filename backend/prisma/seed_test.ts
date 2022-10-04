import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


async function main() {
	



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