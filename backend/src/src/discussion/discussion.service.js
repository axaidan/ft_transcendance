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
exports.DiscussionService = void 0;
const common_1 = require("@nestjs/common");
const discussion_message_service_1 = require("../discussion-message/discussion-message.service");
const prisma_service_1 = require("../prisma/prisma.service");
let DiscussionService = class DiscussionService {
    constructor(prisma, discMsg) {
        this.prisma = prisma;
        this.discMsg = discMsg;
    }
    async create(currentUserId, dto) {
        if (await this.exists(currentUserId, dto.user2Id) === true)
            throw new common_1.HttpException('Discussion already exists', 400);
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: currentUserId,
                user2Id: dto.user2Id,
            }
        });
        return discussion;
    }
    async getDiscussions(currentUserId) {
        const discussions = await this.prisma.discussion.findMany({
            where: {
                OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }]
            },
            include: {
                user1: { select: { id: true, username: true, } },
                user2: { select: { id: true, username: true, } }
            }
        });
        return discussions;
    }
    async getMessagesbyDiscId(discussionId) {
        const messages = await this.prisma.discussionMessage.findMany({
            where: {
                discussionId: discussionId,
            },
            include: {
                user: { select: { id: true, username: true } }
            }
        });
        return messages;
    }
    async findIdByUserId(currentUserId, user2Id) {
        const discussion = await this.prisma.discussion.findFirst({
            where: {
                OR: [
                    { user1Id: currentUserId, user2Id: user2Id },
                    { user1Id: user2Id, user2Id: currentUserId },
                ]
            }
        });
        if (discussion === null)
            return null;
        const discussionId = discussion.id;
        return discussionId;
    }
    async exists(user1Id, user2Id) {
        const search = await this.prisma.discussion.findMany({
            where: { OR: [
                    { user1Id: user1Id, user2Id: user2Id },
                    { user1Id: user2Id, user2Id: user1Id }
                ] }
        });
        if (search.length === 0)
            return (false);
        return (true);
    }
};
DiscussionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        discussion_message_service_1.DiscussionMessageService])
], DiscussionService);
exports.DiscussionService = DiscussionService;
//# sourceMappingURL=discussion.service.js.map