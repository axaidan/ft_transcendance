import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DiscussionDto {
   
    @IsInt()
    user1Id: number;    // ca veut dire que c'est le current user qui a cree

    @IsInt()
    user2Id: number;

    @IsString()
    @IsNotEmpty()
    username1: string;

    @IsString()
    @IsNotEmpty()
    username2: string;

    @IsInt()
    id: number;

}