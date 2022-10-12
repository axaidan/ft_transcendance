"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const mail_module_1 = require("./mail/mail.module");
const achiv_module_1 = require("./achiv/achiv.module");
const relation_module_1 = require("./relations/relation.module");
const discussion_module_1 = require("./discussion/discussion.module");
const discussion_message_module_1 = require("./discussion-message/discussion-message.module");
const game_module_1 = require("./game/game.module");
const avatar_module_1 = require("./avatar/avatar.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UserModule,
            mail_module_1.MailModule,
            achiv_module_1.AchivModule,
            relation_module_1.RelationModule,
            discussion_module_1.DiscussionModule,
            discussion_message_module_1.DiscussionMessageModule,
            game_module_1.GameModule,
            avatar_module_1.AvatarModule,
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map