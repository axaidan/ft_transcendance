import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { IntraAuthGuard } from './intra.guard';
import { Request } from 'express';
import { UsersModule } from 'src/users/users.module';

@Controller('auth')
export class AuthController {

    @UseGuards(IntraAuthGuard)
    @Get('login')
    async getUserFromIntraLogin() {}

    @UseGuards(IntraAuthGuard)
    @Get('intra-callback')
    async intraCallback(@Req() req: Request) {
        return req.user;
        //this.usersService.loginOrCreate();
    }
}
