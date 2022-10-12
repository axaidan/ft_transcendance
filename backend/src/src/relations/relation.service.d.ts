import { Relation, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AchievementService } from "src/achiv/achiv.service";
export declare class RelationService {
    private prisma;
    private achivService;
    constructor(prisma: PrismaService, achivService: AchievementService);
    list_block(userId: number): Promise<User[]>;
    list_friend(userId: number): Promise<User[]>;
    block_user(meId: number, userId: number): Promise<0 | Relation>;
    unblock_user(meId: number, userId: number): Promise<Relation>;
    add_friend(meId: number, userId: number): Promise<Relation>;
    remove_friend(meId: number, userId: number): Promise<Relation>;
    is_friend(meId: number, userId: number): Promise<boolean>;
    is_block(meId: number, userId: number): Promise<boolean>;
}
