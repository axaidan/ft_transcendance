import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DiscussionMessageDto {
   
    @IsInt()
    userId: number;

    @IsInt()
    discId: number;

    @IsString()
    @IsNotEmpty()
    text: string;
    
}