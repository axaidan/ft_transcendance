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
exports.AchivController = void 0;
const common_1 = require("@nestjs/common");
const achiv_service_1 = require("./achiv.service");
const dto_1 = require("./dto");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
let AchivController = class AchivController {
    constructor(achivService) {
        this.achivService = achivService;
    }
    ;
    createAchiv(achivDto) {
        return this.achivService.createAchiv(achivDto);
    }
    getAchiv() {
        return this.achivService.getAchiv();
    }
    updateAchiv(dto) {
        return this.achivService.updateAchiv(dto.userId, dto.achivId);
    }
    listUnlockAchiv(userId) {
        return this.achivService.listUnlockAchiv(userId);
    }
    listLockAchiv(userId) {
        return this.achivService.listLockAchiv(userId);
    }
    findUserForAchivIda(dto) {
        return this.achivService.findUserForAchivId(dto.userId, dto.achivId);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AchivDto]),
    __metadata("design:returntype", void 0)
], AchivController.prototype, "createAchiv", null);
__decorate([
    (0, common_1.Get)('list_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AchivController.prototype, "getAchiv", null);
__decorate([
    (0, common_1.Post)('unlock'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LinkDto]),
    __metadata("design:returntype", void 0)
], AchivController.prototype, "updateAchiv", null);
__decorate([
    (0, common_1.Get)('list_unlock'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AchivController.prototype, "listUnlockAchiv", null);
__decorate([
    (0, common_1.Get)('list_lock'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AchivController.prototype, "listLockAchiv", null);
__decorate([
    (0, common_1.Get)('findAchivForUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LinkDto]),
    __metadata("design:returntype", void 0)
], AchivController.prototype, "findUserForAchivIda", null);
AchivController = __decorate([
    (0, common_1.Controller)('achiv'),
    __metadata("design:paramtypes", [achiv_service_1.AchievementService])
], AchivController);
exports.AchivController = AchivController;
//# sourceMappingURL=achiv.controller.js.map