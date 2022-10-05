import { ForbiddenException, Injectable } from "@nestjs/common";
import { prisma, Relation, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AchievementService } from "src/achiv/achiv.service";
import { identity } from "rxjs";
import { ConstraintMetadata } from "class-validator/types/metadata/ConstraintMetadata";

@Injectable()
export class RelationService{
	constructor(
		private prisma: PrismaService,
		private achivService: AchievementService) {}

		/*
	async is_my_friend(userId: string, userIdToCheck: string) {
		let uid = parseInt(userId, 10);

		let uitc = parseInt(userIdToCheck, 10);

		let user = await this.prisma.user.findFirst({where: {id: uid }});
		let userToFind = await this.prisma.user.findFirst({where: {id: uitc }});
		let curRelation = await this.prisma.relation.findFirst({where: {me: user, userIWatch: userToFind}});
		if (!curRelation) {
			return false;
		}
		if (curRelation.relation === 1)		
			return true;
		return false;

	}

	*/

	async list_block(userId: number) : Promise<User[]> {
	let uid = userId		

	var userArr : User[] = [];
	const blockPeople = await this.prisma.relation.findMany({
		where: {
			userId: uid,
			isBlock: 1,
		},
		select: {
			userIWatch: true,
		}
	})
	for (let people in blockPeople) {
		userArr.push(blockPeople[people].userIWatch);
	}
	return userArr;
	}

	async list_friend(userId: number) : Promise<User[]> {
		let uid = userId;

	var userArr : User[] = [];
		const friends = await this.prisma.relation.findMany({
			where: {
				userId: uid,
				relation: 1,
				isBlock: 0,
			},
			select: {
				userIWatch: true,
			},
		});
		for (let friend in friends) {
			userArr.push(friends[friend].userIWatch);
		}
		console.log(userArr);
		return userArr;
	}		

	async block_user(meId: number, userId: string) {
		
		var blockId = parseInt(userId, 10);
		
		var findMe = this.prisma.user.findFirst({where: {id: meId}});
		var findTarget= this.prisma.user.findFirst({where: {id: blockId}});

		if (!findMe) {
			throw new ForbiddenException('u do not exist')
		}
		if (!findTarget) {
			throw new ForbiddenException('your target do not exist')
		}
		const relation = await this.prisma.relation.findFirst({
			where: {
				userId: meId, 
				userIWatchId: blockId,
			},
		})
		if (relation) {
			console.log("relation existante");
			if (relation.isBlock === 1) {
				console.log("user already block")
				return 0;
			}
			else {
				let updateRelation = await this.prisma.relation.update({
					where : {id: relation.id},
					data: {
						isBlock: 1,
					}
				});
				return updateRelation;
			}
		}
		else {
			try {
				var createBlockRelation = await this.prisma.relation.create({
					data: {
						userId: meId,
						userIWatchId: blockId,
						relation : 0,
						isBlock: 1,
					}
				});
			}
			catch (e) {
				throw new ForbiddenException('error');
			}
			return createBlockRelation;
		}
	}

	async unblock_user(meId: number, userId: string) {
		var targetId = parseInt(userId, 10);

		var findMe = this.prisma.user.findFirst({where: {id: meId}});
		var findTarget= this.prisma.user.findFirst({where: {id: targetId}});

		if (!findMe) {
			throw new ForbiddenException("me not exist");
		}

		if (!findTarget) {
			throw new ForbiddenException("user you looking for doesn't exist");
		}

		const relation = await this.prisma.relation.findFirst({where: {userId: meId, userIWatchId: targetId}});
		if (relation) {
			if (relation.isBlock === 1)	{
				let updateRelation = await this.prisma.relation.update({where: {id: relation.id}, data : {isBlock: 0}})
				return ;
			}
			else 
				return ;
		}
		else {
			return ;
		}
		
	}

	// verifier partout que le userId existe
	async add_friend(meId: number, userId: string) {
		var friendId = parseInt(userId, 10);

			let findMe = await this.prisma.user.findFirst({where: {id: meId}});

		var findNewFriend = await this.prisma.user.findFirst({where: {id: friendId}});

		if (!findMe)
			throw new ForbiddenException("u do not exist")
		if (!findNewFriend) {
			throw new ForbiddenException("friend do not exist")
		}
		let relation = await this.prisma.relation.findFirst({where: {me: findMe, userIWatch: findNewFriend}});

		if (relation) {
			console.log('relation deja creer');
			if (relation.relation === 1){
				console.log('deja ami');
				return relation;
			}
			else {
				console.log("update de la relation");
				const updateRelation = await this.prisma.relation.update({where: {id: relation.id}, 
				data: {
					relation: 1,
				}})
				return updateRelation;
			}
		}
		else {
			try {
				var newRelation = await this.prisma.relation.create({data: {
					userId: meId,
					userIWatchId: friendId,	
					relation: 1,
					}});
				}
			catch (e) {
				throw new ForbiddenException('error');
				}
			console.log("je creer la relation");
			var num = meId.toString();
			let curlyAchiv = await this.achivService.findUserForAchivId(num, "4")
			if (!curlyAchiv) {
				console.log("je go faire l'achiv");
				this.achivService.updateAchiv(num, "4");
			}
			return newRelation;
		}
	}

	/*
	async add_user(meId: string, user_id_to_add: string) {
		let uid = parseInt(meId, 10);
		let uidta = parseInt(user_id_to_add, 10)
		let meUser = await this.prisma.user.findFirst({where: {id: uid}});
		let user_to_add = await this.prisma.user.findFirst({where: {id: uidta}});

		let relation = await this.prisma.relation.findFirst({where: {me: meUser, userIWatch: user_to_add}});

		if (relation) {
			console.log("relation deja creer, status :");
			console.log(relation.relation);
			return ;
		}
		else {
			let newRelation = await this.prisma.relation.create({data: {
				userId: meUser.id,
				userIWatchId: user_to_add.id,	
				relation: 0,

			}});
			return newRelation;
		}

		return ;
	}
	*/

}