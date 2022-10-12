import { PrismaService } from "../prisma/prisma.service";
export declare class AchievementService {
    private prisma;
    constructor(prisma: PrismaService);
    createAchiv(AchivDto: any): Promise<import(".prisma/client").Achievement & {
        users: import(".prisma/client").User[];
    }>;
    getAchiv(): Promise<(import(".prisma/client").Achievement & {
        users: import(".prisma/client").User[];
    })[]>;
    updateAchiv(userId: string, achivId: string): Promise<import(".prisma/client").Achievement>;
    findUserForAchivId(userId: string, achivId: string): Promise<import(".prisma/client").User[]>;
    listUnlockAchiv(meId: number): Promise<import(".prisma/client").Achievement[]>;
    listLockAchiv(meId: number): Promise<import(".prisma/client").Achievement[]>;
    deleteAchiv: (AchivDto: any) => void;
}
