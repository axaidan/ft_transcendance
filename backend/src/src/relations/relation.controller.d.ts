import { RelationService } from "./relation.service";
import { User } from "@prisma/client";
export declare class RelationController {
    private relationService;
    constructor(relationService: RelationService);
    add_friend(meId: number, userId: number): Promise<import(".prisma/client").Relation>;
    remove_friend(meId: number, userId: number): Promise<import(".prisma/client").Relation>;
    block_user(meId: number, userId: number): Promise<0 | import(".prisma/client").Relation>;
    unblock_user(meId: number, userId: number): Promise<import(".prisma/client").Relation>;
    list(user: number): Promise<User[]>;
    list_block(user: number): Promise<User[]>;
    is_friend(meId: number, userId: number): Promise<boolean>;
    is_block(meId: number, userId: number): Promise<boolean>;
}
