import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class AvatarService {
  constructor(private cloudinary: CloudinaryService,
				private prisma: PrismaService) {}

  async uploadImageToCloudinary(file: Express.Multer.File, userId: number) {
	var owner = await this.prisma.user.findFirst({where: {id: userId}});
	if (!owner)
		throw new ForbiddenException('u do not exit');
	var ret = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });


	let newAvatar = await this.prisma.avatar.upsert({where: { url: ret.url},
		update: {},
		create: {
			url : ret.url,
			is_public: false,
			public_id: ret.public_id,
		},
	})

	var updateUser = await this.prisma.user.update({where :{id: userId},
	data : {
		avatarId: newAvatar.id,
	}})
	return ret;
  }

  async uploadImageToCloudinaryPublic(file: Express.Multer.File) {
	var ret = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
	let newAvatar = await this.prisma.avatar.upsert({where: { url: ret.url},
		update: {},
		create: {
			url : ret.url,
			is_public: true,
			public_id: ret.public_id,
		},
	})

	return newAvatar;
  }



  async list_avatar(userId: number) {

	var me = await this.prisma.user.findFirst({where: { id: userId}})



	var list = await this.prisma.avatar.findMany({where: {
		OR : [{is_public : true}, {id : me.avatarId}]
		

	}})

	console.log(list);
	return  list;
  }

  async getTag(public_id: string) {
	let ret = await this.cloudinary.getTag(public_id);
	return ret;
  }
}