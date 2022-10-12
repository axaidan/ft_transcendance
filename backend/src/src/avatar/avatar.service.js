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
exports.AvatarService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("./cloudinary/cloudinary.service");
let AvatarService = class AvatarService {
    constructor(cloudinary, prisma) {
        this.cloudinary = cloudinary;
        this.prisma = prisma;
    }
    async uploadImageToCloudinary(file, userId) {
        var owner = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!owner)
            throw new common_1.ForbiddenException('u do not exit');
        var ret = await this.cloudinary.uploadImage(file).catch(() => {
            throw new common_1.BadRequestException('Invalid file type.');
        });
        if (owner.avatarId) {
            await this.remove_avatar(userId);
        }
        let newAvatar = await this.prisma.avatar.upsert({ where: { url: ret.url },
            update: {},
            create: {
                url: ret.url,
                is_public: false,
                public_id: ret.public_id,
            },
        });
        var updateUser = await this.prisma.user.update({ where: { id: userId },
            data: {
                avatarId: newAvatar.id,
            } });
        return ret;
    }
    async uploadImageToCloudinaryPublic(file) {
        var ret = await this.cloudinary.uploadImage(file).catch(() => {
            throw new common_1.BadRequestException('Invalid file type.');
        });
        let newAvatar = await this.prisma.avatar.upsert({ where: { url: ret.url },
            update: {},
            create: {
                url: ret.url,
                is_public: true,
                public_id: ret.public_id,
            },
        });
        return newAvatar;
    }
    async list_avatar(userId) {
        var me = await this.prisma.user.findFirst({ where: { id: userId } });
        var list = await this.prisma.avatar.findMany({ where: {
                OR: [{ is_public: true }, { id: me.avatarId }]
            } });
        console.log(list);
        return list;
    }
    async remove_avatar(userId) {
        var me = await this.prisma.user.findFirst({ where: { id: userId } });
        var avatar = await this.prisma.avatar.findFirst({ where: { id: me.avatarId } });
        if (!avatar) {
            cloudinary_1.v2.uploader.destroy(avatar.public_id);
        }
    }
};
AvatarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService,
        prisma_service_1.PrismaService])
], AvatarService);
exports.AvatarService = AvatarService;
//# sourceMappingURL=avatar.service.js.map