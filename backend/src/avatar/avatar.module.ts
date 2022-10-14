import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
imports: [ CloudinaryModule ],
controllers: [AvatarController],
providers: [AvatarService],
})
export class AvatarModule {}