import { AchievementService } from './achiv.service';
import { AchivDto, LinkDto } from './dto';
export declare class AchivController {
    private achivService;
    constructor(achivService: AchievementService);
    createAchiv(achivDto: AchivDto): Promise<import(".prisma/client").Achievement & {
        users: import(".prisma/client").User[];
    }>;
    getAchiv(): Promise<(import(".prisma/client").Achievement & {
        users: import(".prisma/client").User[];
    })[]>;
    updateAchiv(dto: LinkDto): Promise<import(".prisma/client").Achievement>;
    listUnlockAchiv(userId: number): Promise<import(".prisma/client").Achievement[]>;
    listLockAchiv(userId: number): Promise<import(".prisma/client").Achievement[]>;
    findUserForAchivIda(dto: LinkDto): Promise<import(".prisma/client").User[]>;
}
