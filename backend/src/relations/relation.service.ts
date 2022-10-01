import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AchivmentService } from "src/achiv/achiv.service";
import { identity } from "rxjs";

@Injectable()
export class RelationService{
	constructor(
		private prisma: PrismaService,
		private achivService: AchivmentService) {}

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

	async list_block(userId: string) {
	let uid = parseInt(userId, 10);		

	let list = await this.prisma.relation.findMany({where: {userId: uid, relation: 2}});

	return list;

	}

	async list(userId: string ) {
		let uid = parseInt(userId, 10);

		let list = await this.prisma.relation.findMany({where: {userId: uid, relation: 1}})
		return list;
	}		

	async block_user(meId: string, user_id_to_add: string) {
		let uid = parseInt(meId, 10);
		let uidta = parseInt(user_id_to_add, 10)
		let meUser = await this.prisma.user.findFirst({where: {id: uid}});
		let user_to_add = await this.prisma.user.findFirst({where: {id: uidta}});

		let relation = await this.prisma.relation.findFirst({where: {me: meUser, userIWatch: user_to_add}});

		if (relation) {
			console.log('relation deja creer');
			if (relation.relation === 2){
				console.log('deja ami');
				return relation;
			}
			else {
				console.log("update de la relation");
				const updateRelation = await this.prisma.relation.update({where: {id: relation.id}, 
				data: {
					relation: 2,
				}})
				return updateRelation;
			}
		}
		else {
			let newRelation = await this.prisma.relation.create({data: {
				userId: meUser.id,
				userIWatchdId: user_to_add.id,	
				relation: 2,

			}});
			return newRelation;
		}

		return ;
	}



	async add_friend(meId: string, user_id_to_add: string) {
		let uid = parseInt(meId, 10);
		let uidta = parseInt(user_id_to_add, 10)
		let meUser = await this.prisma.user.findFirst({where: {id: uid}});
		let user_to_add = await this.prisma.user.findFirst({where: {id: uidta}});

		let relation = await this.prisma.relation.findFirst({where: {me: meUser, userIWatch: user_to_add}});

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
			let newRelation = await this.prisma.relation.create({data: {
				userId: meUser.id,
				userIWatchdId: user_to_add.id,	
				relation: 1,

			}});
			console.log("je creer la relation");
			var num = meUser.id.toString();
			let curlyAchiv = await this.achivService.findUserForAchivId(num, "4")
			if (!curlyAchiv) {
				console.log("je go faire l'achiv");
				this.achivService.updateAchiv(num, "4");
			}
			return newRelation;
		}

		return ;
	}

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
				userIWatchdId: user_to_add.id,	
				relation: 0,

			}});
			return newRelation;
		}

		return ;
	}


}