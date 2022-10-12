"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationModule = void 0;
const common_1 = require("@nestjs/common");
const achiv_service_1 = require("../achiv/achiv.service");
const guard_1 = require("../auth/guard");
const strategie_1 = require("../auth/strategie");
const relation_controller_1 = require("./relation.controller");
const relation_service_1 = require("./relation.service");
let RelationModule = class RelationModule {
};
RelationModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [relation_controller_1.RelationController],
        providers: [relation_service_1.RelationService,
            achiv_service_1.AchievementService,
            strategie_1.FtStrategy,
            guard_1.JwtGuard]
    })
], RelationModule);
exports.RelationModule = RelationModule;
//# sourceMappingURL=relation.module.js.map