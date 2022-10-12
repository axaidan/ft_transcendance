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
exports.AvatarController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const avatar_service_1 = require("./avatar.service");
let AvatarController = class AvatarController {
    constructor(avatarService) {
        this.avatarService = avatarService;
    }
    ;
    uploadImage(meId, file) {
        return this.avatarService.uploadImageToCloudinary(file, meId);
    }
    uploadImagePublic(file) {
        return this.avatarService.uploadImageToCloudinaryPublic(file);
    }
    list_avatar(meId) {
        return this.avatarService.list_avatar(meId);
    }
    remove_avatar(meId) {
        return this.avatarService.remove_avatar(meId);
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('upload_public'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "uploadImagePublic", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "list_avatar", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "remove_avatar", null);
AvatarController = __decorate([
    (0, common_1.Controller)('avatar'),
    __metadata("design:paramtypes", [avatar_service_1.AvatarService])
], AvatarController);
exports.AvatarController = AvatarController;
//# sourceMappingURL=avatar.controller.js.map