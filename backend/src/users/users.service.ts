import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class UsersService {
//     constructor(
//         private prisma: PrismaService
//     ) {}

//     async findOne(username: string) {
//         console.log("findOne() - searching for " + username);
//         const user = await this.prisma.user.findUnique({
//             where: {
//                 login: username
//             }
//         });
//         console.log("findOne() - found : " + user);
//         return user;
//     }

//     async create(username: string) {
//         console.log("creating user " + username);
//         const user = await this.prisma.user.create({
//             data: {
//                 login: username
//             }
//         });
//         return user;
//     }
// }

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {};

}
