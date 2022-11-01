import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelUserService } from '../channel-user/channel-user.service';

// @Injectable()
// export class ForbiddenforbiddenStatusGuard implements CanActivate {

//     constructor(
//         private reflector: Reflector,
//         private channelUserService: ChannelUserService,
//     ) { }

//     async canActivate(context: ExecutionContext)
//         : Promise<boolean> {
//         const forbiddenStatus = this.reflector.get<string[]>('status', context.getHandler());
//         if (!forbiddenStatus) {
//             return true;
//         }

//         // console.log(`forbiddenStatus = ${roles}`)
        
//         const request = context.switchToHttp().getRequest();
//         const userId = request.user['id'];
//         const chanId = request.body['chanId'];
//         const channelUser = await this.channelUserService.findOne(userId, chanId);
//         // console.log('channelUser = ', channelUser);
//         if (channelUser === null)
//             throw new NotFoundException('user not found in channel');

//         if (forbiddenStatus[0] === 'normal') {
//             // console.log(`returning ${channelUser.role === EChannelforbiddenStatus.ADMIN || channelUser.role === EChannelRoles.OWNER}`);

//         }
//         if (forbiddenStatus[0] === 'owner') {
//             // console.log(`returning ${channelUser.role === EChannelforbiddenStatus.OWNER}`);
//         }

//         // console.log(`returning false`);
//         return false;
//     }
// }