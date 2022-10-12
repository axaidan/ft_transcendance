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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const guard_1 = require("./guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signin(req) { }
    async callback(req, response) {
        let token;
        await this.authService.signin(req.user.toString())
            .then((res) => {
            token = res;
            response.cookie('access_token', token, {
                expires: new Date(Date.now() + 6000000)
            });
            response.redirect("http://localhost:4200/home");
        })
            .catch((e) => {
            response.redirect("http://localhost:4200");
        });
    }
    twoFaCallback(query, response) {
        const token = query.token;
        response.cookie('access_token', token, {
            expires: new Date(Date.now() + 6000000)
        });
        response.redirect("http://localhost:4200/home");
    }
    async signinTest(login, response) {
        let token;
        console.log("AuthController - signinTest(" + login + ")");
        await this.authService.signinTest(login)
            .then((res) => {
            token = res;
            response.cookie('access_token', token, {
                expires: new Date(Date.now() + 6000000)
            });
            console.log("AuthController - redirecting to 4200/home");
            response.redirect("http://localhost:4200/home");
        })
            .catch((e) => {
            response.redirect("http://localhost:4200/signinTes");
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(guard_1.FtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('signin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.UseGuards)(guard_1.FtGuard),
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)('2fa-callback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "twoFaCallback", null);
__decorate([
    (0, common_1.Get)('signin-test'),
    __param(0, (0, common_1.Query)('login')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinTest", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map