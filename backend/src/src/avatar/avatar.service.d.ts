/// <reference types="multer" />
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
export declare class AvatarService {
    private cloudinary;
    private prisma;
    constructor(cloudinary: CloudinaryService, prisma: PrismaService);
    uploadImageToCloudinary(file: Express.Multer.File, userId: number): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    uploadImageToCloudinaryPublic(file: Express.Multer.File): Promise<import(".prisma/client").Avatar>;
    list_avatar(userId: number): Promise<import(".prisma/client").Avatar[]>;
    remove_avatar(userId: number): Promise<void>;
}
