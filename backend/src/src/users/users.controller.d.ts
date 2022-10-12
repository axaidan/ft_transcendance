import { UserService } from './users.service';
import { User } from '@prisma/client';
import { EditUserDto } from './dto/edit-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User[]>;
    getme(user: User): User;
    getUserById(userId: number): Promise<User>;
    editUser(userId: number, dto: EditUserDto): Promise<User>;
}
