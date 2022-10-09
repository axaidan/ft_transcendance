import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PrismaService } from "src/prisma/prisma.service";
import { AvatarService } from "./avatar.service";


@Controller('avatar')
export class AvatarController {
	constructor (private avatarService: AvatarService) {};

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadImage(@UploadedFile() file: Express.Multer.File) {
		return this.avatarService.uploadImageToCloudinary(file);
	}

	@Get('tag')
	getTag(@Body() public_id:string ) {
		return this.avatarService.getTag(public_id);
	}
}