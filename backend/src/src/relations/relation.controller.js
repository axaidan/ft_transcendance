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
exports.RelationController = void 0;
const common_1 = require("@nestjs/common");
const decorator_1 = require("../auth/decorator");
const relation_service_1 = require("./relation.service");
const guard_1 = require("../auth/guard");
let RelationController = class RelationController {
    constructor(relationService) {
        this.relationService = relationService;
    }
    add_friend(meId, userId) {
        return this.relationService.add_friend(meId, userId);
    }
    remove_friend(meId, userId) {
        return this.relationService.remove_friend(meId, userId);
    }
    block_user(meId, userId) {
        return this.relationService.block_user(meId, userId);
    }
    unblock_user(meId, userId) {
        return this.relationService.unblock_user(meId, userId);
    }
    async list(user) {
        const array = await this.relationService.list_friend(user);
        return array;
    }
    async list_block(user) {
        const array = await this.relationService.list_block(user);
        return array;
    }
    async is_friend(meId, userId) {
        return this.relationService.is_friend(meId, userId);
    }
    async is_block(meId, userId) {
        return this.relationService.is_block(meId, userId);
    }
};
__decorate([
    (0, common_1.Post)('add_friend/:id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RelationController.prototype, "add_friend", null);
__decorate([
    (0, common_1.Post)('remove_friend/:id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RelationController.prototype, "remove_friend", null);
__decorate([
    (0, common_1.Post)('block_user/:id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RelationController.prototype, "block_user", null);
__decorate([
    (0, common_1.Post)('unblock_user/:id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RelationController.prototype, "unblock_user", null);
__decorate([
    (0, common_1.Get)('list_friend'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RelationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('list_block'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RelationController.prototype, "list_block", null);
__decorate([
    (0, common_1.Get)('is_friend/:id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RelationController.prototype, "is_friend", null);
__decorate([
    (0, common_1.Get)('is_block/:id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RelationController.prototype, "is_block", null);
RelationController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('relation'),
    __metadata("design:paramtypes", [relation_service_1.RelationService])
], RelationController);
exports.RelationController = RelationController;
//# sourceMappingURL=relation.controller.js.map