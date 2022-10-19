import { IsInt, IsNotEmpty } from "class-validator";

export class SigninTestDto {

    @IsNotEmpty()
    login: string;

}