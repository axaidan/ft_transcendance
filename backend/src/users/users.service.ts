import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [];

    async findOne(username: string) {
        return this.users.find(user => user.username === username);
    }
}
