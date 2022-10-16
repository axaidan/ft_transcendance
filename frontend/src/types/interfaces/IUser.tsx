export type IUser = {
    id: number,
    login: string,
    username: string,
    email: string,
    createdAt: string,
    updatedAt: string
    twoFactorAuth: boolean,
    avatar: string,
}

export const DflUser:IUser = {
	id: 0,
	login: "username",
    username: "string",
    email: "string",
    createdAt: "string",
    updatedAt: "string",
    twoFactorAuth: false,
    avatar: ""
}