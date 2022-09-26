import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {}

    async findUserFromIntraUsername(intraUsername: string) : Promise<any> {
        const user = await this.usersService.findOne(intraUsername);

        // if (!user) {
        //     throw new UnauthorizedException();
        // }

        return user;
    }

    async validateUser(username: string) : Promise<any> {
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new UnauthorizedException();
          }
        return user;
      }
}
