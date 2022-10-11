import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { PrismaService } from "src/prisma/prisma.service";
import { AvatarService } from "./avatar.service";


@Controller('avatar')
export class AvatarController {
	constructor (private avatarService: AvatarService) {};

	@Post('upload')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file'))
	uploadImage(@GetUser('id') meId: number,@UploadedFile() file: Express.Multer.File) {
		return this.avatarService.uploadImageToCloudinary(file, meId);
	}


	@Post('upload_public')
	@UseInterceptors(FileInterceptor('file'))
	uploadImagePublic(@UploadedFile() file: Express.Multer.File) {
		return this.avatarService.uploadImageToCloudinaryPublic(file);
	}


	@Get('tag')
	getTag(@Body() public_id:string ) {
		return this.avatarService.getTag(public_id);
	}
}