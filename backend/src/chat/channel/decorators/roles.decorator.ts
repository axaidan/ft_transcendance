import { SetMetadata } from '@nestjs/common';

export const ChannelRoles = (...roles: string[]) => SetMetadata('roles', roles);