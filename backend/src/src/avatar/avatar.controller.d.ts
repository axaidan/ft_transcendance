/// <reference types="multer" />
import { AvatarService } from "./avatar.service";
export declare class AvatarController {
    private avatarService;
    constructor(avatarService: AvatarService);
    uploadImage(meId: number, file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    uploadImagePublic(file: Express.Multer.File): Promise<import(".prisma/client").Avatar>;
    list_avatar(meId: number): Promise<import(".prisma/client").Avatar[]>;
    remove_avatar(meId: number): Promise<void>;
}
