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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscussionController = void 0;
const common_1 = require("@nestjs/common");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const discussion_service_1 = require("./discussion.service");
const dto_1 = require("./dto");
let DiscussionController = class DiscussionController {
    constructor(discService) {
        this.discService = discService;
    }
    create(currentUserId, dto) {
        return this.discService.create(currentUserId, dto);
    }
    async getMessagesByUserId(currentUserId, user2Id) {
        const discId = await this.discService.findIdByUserId(currentUserId, user2Id);
        if (!discId) {
            return [];
        }
        return this.discService.getMessagesbyDiscId(discId);
    }
    getDiscussions(currentUserId) {
        return this.discService.getDiscussions(currentUserId);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.DiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':userid'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('userid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], DiscussionController.prototype, "getMessagesByUserId", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DiscussionController.prototype, "getDiscussions", null);
DiscussionController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('discussion'),
    __metadata("design:paramtypes", [discussion_service_1.DiscussionService])
], DiscussionController);
exports.DiscussionController = DiscussionController;
//# sourceMappingURL=discussion.controller.js.map