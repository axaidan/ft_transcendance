import { SetMetadata } from '@nestjs/common';

export const ForbiddenStatus = (...status: string[]) => SetMetadata('status', status);
