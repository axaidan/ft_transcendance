import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class AvatarService {
	constructor(private cloudinary: CloudinaryService,
		private prisma: PrismaService) { }

	async uploadImageToCloudinary(file: Express.Multer.File, userId: number) {
		var owner = await this.prisma.user.findFirst({ where: { id: userId } });
		if (!owner)
			throw new ForbiddenException('u do not exit');
		var ret = await this.cloudinary.uploadImage(file).catch(() => {
			throw new BadRequestException('Invalid file type.');
		});

		if (owner.avatarUrl) {
			await this.remove_avatar(userId);
		}

		let newAvatar = await this.prisma.avatar.upsert({
			where: { url: ret.url },
			update: {},
			create: {
				url: ret.url,
				is_public: false,
				public_id: ret.public_id,
			},
		})

		var updateUser = await this.prisma.user.update({
			where: { id: userId },
			data: {
				avatarUrl: newAvatar.url,
			}
		})
		return ret;
	}

	async uploadImageToCloudinaryPublic(file: Express.Multer.File) {
		var ret = await this.cloudinary.uploadImage(file).catch(() => {
			throw new BadRequestException('Invalid file type.');
		});
		let newAvatar = await this.prisma.avatar.upsert({
			where: { url: ret.url },
			update: {},
			create: {
				url: ret.url,
				is_public: true,
				public_id: ret.public_id,
			},
		})

		return newAvatar;
	}



	async list_avatar(userId: number) {

		var me = await this.prisma.user.findFirst({ where: { id: userId } })



		var list = await this.prisma.avatar.findMany({
			where: {
				OR: [{ is_public: true }, { url: me.avatarUrl }]
			},
			select: {
				id: true,
				url: true,
			}
		})

		console.log(list);
		return list;
	}

	async remove_avatar(userId: number) {
		var me = await this.prisma.user.findFirst({ where: { id: userId } })

		var avatar = await this.prisma.avatar.findFirst({ where: { url: me.avatarUrl } });

		if (!avatar) {
			v2.uploader.destroy(avatar.public_id);
		}
	}

	async edit_avatar(userId: number, avatarId: number) {
		var findMe = await this.prisma.user.findFirst({ where: { id: userId } })

		var findAvatar = await this.prisma.avatar.findFirst({
			where: {
				id: avatarId,
				is_public: true,
			},
		})

		if (!findMe)
			throw new ForbiddenException('u not exit')
		if (!findAvatar)
			throw new ForbiddenException('wrong avatar id')

		var updateUser = await this.prisma.user.update({
			where: { id: userId },
			data: { avatarUrl: findAvatar.url },
		})

		return;
	}

}