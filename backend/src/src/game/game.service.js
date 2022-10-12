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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GameService = class GameService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async history(userId) {
        const arrayGame = await this.prisma.game.findMany({
            where: {
                OR: [
                    { player1Id: userId },
                    { player2Id: userId },
                ],
            },
            orderBy: {
                createAt: 'desc',
            },
            take: 10,
            select: {
                score1: true,
                player1: { select: { id: true, username: true, }, },
                score2: true,
                player2: { select: { id: true, username: true }, },
            }
        });
        return arrayGame;
    }
    async createGame(dto) {
        if (dto.score1 < 0 || dto.score2 < 0)
            throw new common_1.ForbiddenException('score negatif error');
        let findUser1 = this.prisma.user.findFirst({ where: { id: dto.userId1 } });
        let findUser2 = this.prisma.user.findFirst({ where: { id: dto.userId2 } });
        if (!findUser1 || !findUser2)
            throw new common_1.ForbiddenException('score negatif error');
        const newGame = await this.prisma.game.create({
            data: {
                player1Id: dto.userId1,
                player2Id: dto.userId2,
                score1: dto.score1,
                score2: dto.score2,
            }
        });
        return newGame;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map