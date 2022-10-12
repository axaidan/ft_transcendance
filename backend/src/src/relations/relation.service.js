"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const achiv_service_1 = require("../achiv/achiv.service");
let RelationService = class RelationService {
    constructor(prisma, achivService) {
        this.prisma = prisma;
        this.achivService = achivService;
    }
    async list_block(userId) {
        let uid = userId;
        var userArr = [];
        const blockPeople = await this.prisma.relation.findMany({
            where: {
                userId: uid,
                isBlock: 1,
            },
            select: {
                userIWatch: true,
            }
        });
        for (let people in blockPeople) {
            userArr.push(blockPeople[people].userIWatch);
        }
        return userArr;
    }
    async list_friend(userId) {
        let uid = userId;
        var userArr = [];
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
        return userArr;
    }
    async block_user(meId, userId) {
        var blockId = userId;
        var findMe = this.prisma.user.findFirst({ where: { id: meId } });
        var findTarget = this.prisma.user.findFirst({ where: { id: blockId } });
        if (!findMe) {
            throw new common_1.ForbiddenException('u do not exist');
        }
        if (!findTarget) {
            throw new common_1.ForbiddenException('your target do not exist');
        }
        const relation = await this.prisma.relation.findFirst({
            where: {
                userId: meId,
                userIWatchId: blockId,
            },
        });
        if (relation) {
            if (relation.isBlock === 1) {
                return 0;
            }
            else {
                let updateRelation = await this.prisma.relation.update({
                    where: { id: relation.id },
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
                        relation: 0,
                        isBlock: 1,
                    }
                });
            }
            catch (e) {
                throw new common_1.ForbiddenException('error');
            }
            return createBlockRelation;
        }
    }
    async unblock_user(meId, userId) {
        var targetId = userId;
        var findMe = await this.prisma.user.findFirst({ where: { id: meId } });
        var findTarget = await this.prisma.user.findFirst({ where: { id: targetId } });
        if (!findMe) {
            throw new common_1.ForbiddenException("me not exist");
        }
        if (!findTarget) {
            throw new common_1.ForbiddenException("user you looking for doesn't exist");
        }
        const relation = await this.prisma.relation.findFirst({ where: { userId: meId, userIWatchId: targetId } });
        if (relation) {
            if (relation.isBlock === 1) {
                if (relation.relation === 1) {
                    let updateRelation = await this.prisma.relation.update({ where: { id: relation.id }, data: { isBlock: 0 } });
                    return updateRelation;
                }
                const deleteRelation = await this.prisma.relation.delete({ where: { id: relation.id } });
                return deleteRelation;
            }
            else
                return relation;
        }
        else {
            return relation;
        }
    }
    async add_friend(meId, userId) {
        var friendId = userId;
        let findMe = await this.prisma.user.findFirst({ where: { id: meId } });
        var findNewFriend = await this.prisma.user.findFirst({ where: { id: friendId } });
        if (!findMe)
            throw new common_1.ForbiddenException("u do not exist");
        if (!findNewFriend) {
            throw new common_1.ForbiddenException("friend do not exist");
        }
        let relation = await this.prisma.relation.findFirst({ where: { me: findMe, userIWatch: findNewFriend } });
        if (relation) {
            if (relation.relation === 1) {
                return relation;
            }
            else {
                const updateRelation = await this.prisma.relation.update({ where: { id: relation.id },
                    data: {
                        relation: 1,
                    } });
                return updateRelation;
            }
        }
        else {
            try {
                var newRelation = await this.prisma.relation.create({ data: {
                        userId: meId,
                        userIWatchId: friendId,
                        relation: 1,
                    } });
            }
            catch (e) {
                throw new common_1.ForbiddenException('error');
            }
            var num = meId.toString();
            let curlyAchiv = await this.achivService.findUserForAchivId(num, "4");
            if (!curlyAchiv) {
                this.achivService.updateAchiv(num, "4");
            }
            return newRelation;
        }
    }
    async remove_friend(meId, userId) {
        let friendId = userId;
        let findMe = await this.prisma.user.findFirst({ where: { id: meId } });
        let findFriend = await this.prisma.user.findFirst({ where: { id: friendId } });
        if (!findMe)
            throw new common_1.ForbiddenException('u not exist');
        if (!findFriend)
            throw new common_1.ForbiddenException('u r friend not exist');
        let relation = await this.prisma.relation.findFirst({ where: { userId: meId, userIWatchId: friendId } });
        if (relation) {
            if (relation.relation === 1) {
                if (relation.isBlock === 1) {
                    var updateRelation = await this.prisma.relation.update({ where: { id: relation.id }, data: { relation: 0 } });
                    return updateRelation;
                }
                else {
                    const deleteRelation = await this.prisma.relation.delete({ where: { id: relation.id } });
                    return deleteRelation;
                }
            }
        }
        return relation;
    }
    async is_friend(meId, userId) {
        let findMe = await this.prisma.user.findFirst({ where: { id: meId } });
        let findTarget = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!findMe) {
            throw new common_1.ForbiddenException('u not exit');
            return false;
        }
        if (!findTarget) {
            throw new common_1.ForbiddenException('u r friend not exit');
            return false;
        }
        let relation = await this.prisma.relation.findFirst({ where: { userId: meId, userIWatchId: userId } });
        if (relation) {
            if (relation.relation === 1) {
                return true;
            }
            return false;
        }
        return false;
    }
    async is_block(meId, userId) {
        let findMe = await this.prisma.user.findFirst({ where: { id: meId } });
        let findTarget = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!findMe) {
            throw new common_1.ForbiddenException('u not exit');
            return false;
        }
        if (!findTarget) {
            throw new common_1.ForbiddenException('u r friend not exit');
            return false;
        }
        let relation = await this.prisma.relation.findFirst({ where: { userId: meId, userIWatchId: userId } });
        if (relation) {
            if (relation.isBlock === 1) {
                return true;
            }
            return false;
        }
        return false;
    }
};
RelationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        achiv_service_1.AchievementService])
], RelationService);
exports.RelationService = RelationService;
//# sourceMappingURL=relation.service.js.map