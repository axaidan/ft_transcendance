import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(userId: number): Promise<import(".prisma/client").User>;
    getAllUser(): Promise<import(".prisma/client").User[]>;
    editUser(userId: number, dto: EditUserDto): Promise<import(".prisma/client").User>;
}
