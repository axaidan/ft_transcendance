import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { IntraAuthGuard } from './intra.guard';
import { Request } from 'express';

import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {

    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(IntraAuthGuard)
    @Get('login')
    async getUserFromIntraLogin() {}

    @UseGuards(IntraAuthGuard)
    @Get('intra-callback')
    async intraCallback(@Req() req: Request) {
        console.log("intraCallback - getting username");
        const username = req.user.toString();
        console.log("intraCallback - got " + username + " username");
        const user = await this.usersService.findOne(username);
        console.log("intraCallback - user === " + user);
        if (user === null) {
            console.log("intraCallback - did not find " + username);
            await this.usersService.create(username);
        } 
    }
}
