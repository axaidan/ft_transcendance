import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { IntraAuthGuard } from './intra.guard';
import { Request } from 'express';
import { UsersModule } from 'src/users/users.module';

@Controller('auth')
export class AuthController {

    @UseGuards(IntraAuthGuard)
    @Get('login')
    async getUserFromIntraLogin(@Req() req) {
        // return req.user;
    }

    @UseGuards(IntraAuthGuard)
    @Get('intra-callback')
    async intraCallback(@Req() req: Request) {
        // console.log(query);
        return req.user;
    }
}
