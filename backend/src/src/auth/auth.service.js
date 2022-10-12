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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(prisma, conf, jwt, mailService) {
        this.prisma = prisma;
        this.conf = conf;
        this.jwt = jwt;
        this.mailService = mailService;
    }
    async signin(login) {
        let user = await this.prisma.user.findFirst({ where: { login: login } });
        if (!user)
            user = await this.prisma.user.create({
                data: {
                    login: login,
                    username: login,
                    email: login + '@student.42.fr',
                }
            });
        const token = await this.signToken(user.id, user.login);
        if (user.twoFactorAuth === true) {
            this.mailService.sendLoginToken(user, token.access_token);
            return undefined;
        }
        return token.access_token;
    }
    async signToken(userId, login) {
        const payload = { sub: userId, login };
        const secret = this.conf.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, { expiresIn: '30m', secret: secret });
        return { access_token: token };
    }
    async signinTest(login) {
        console.log("AuthService - signinTest(" + login + ")");
        let user = await this.prisma.user.findFirst({ where: { login: login } });
        if (!user) {
            console.log("AuthService - " + login + " NOT FOUND");
            throw new common_1.NotFoundException(`TEST SIGNIN FAILED - USER ${login} NOT FOUND`);
        }
        ;
        const token = await this.signToken(user.id, user.login);
        if (user.twoFactorAuth === true) {
            this.mailService.sendLoginToken(user, token.access_token);
            return undefined;
        }
        console.log("AuthService - " + login + " FOUND");
        return token.access_token;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map