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
exports.AchievementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AchievementService = class AchievementService {
    constructor(prisma) {
        this.prisma = prisma;
        this.deleteAchiv = (AchivDto) => { };
    }
    async createAchiv(AchivDto) {
        const newAchiv = await this.prisma.achievement.create({ data: AchivDto, include: { users: true } });
        return newAchiv;
    }
    async getAchiv() {
        const achivs = await this.prisma.achievement.findMany({ include: { users: true } });
        console.log(achivs);
        return achivs;
    }
    async updateAchiv(userId, achivId) {
        let uid = parseInt(userId, 10);
        let aid = parseInt(achivId, 10);
        const user = await this.prisma.user.findFirst({ where: { id: uid } });
        const unlock = await this.prisma.achievement.update({ where: { id: aid },
            data: {
                users: {
                    connect: [{ id: user.id }]
                }
            } });
        console.log(unlock);
        return unlock;
    }
    async findUserForAchivId(userId, achivId) {
        let uid = parseInt(userId, 10);
        let aid = parseInt(achivId, 10);
        let soldat = await this.prisma.user.findFirst({ where: { id: uid } });
        let achiv = await this.prisma.achievement.findFirst({ where: { id: aid } }).users({ where: { id: uid } });
        if (!achiv.length) {
            console.log("nothing found");
            return null;
        }
        else {
            console.log(achiv);
        }
        return achiv;
    }
    async listUnlockAchiv(meId) {
        var findMe = await this.prisma.user.findFirst({ where: { id: meId },
        });
        if (!findMe)
            throw new common_1.ForbiddenException('u not exist');
        var list = await this.prisma.achievement.findMany({
            where: { users: { some: findMe } },
        });
        return list;
    }
    async listLockAchiv(meId) {
        var findMe = await this.prisma.user.findFirst({ where: { id: meId },
        });
        if (!findMe)
            throw new common_1.ForbiddenException('u not exist');
        var list = await this.prisma.achievement.findMany({
            where: { users: { none: findMe } },
        });
        return list;
    }
};
AchievementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementService);
exports.AchievementService = AchievementService;
//# sourceMappingURL=achiv.service.js.map