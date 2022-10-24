export type IAvatar = {
	id: number,
	url: string,
	is_public: boolean,
	public_id: string
}

export const DflAvatar: IAvatar = {
	id: 1,
	url: 'https://res.cloudinary.com/dq998jfzk/image/upload/v1665425792/vbxxdzbgzoixomwrdxrr.jpg',
	is_public: true,
	public_id: 'lala'
}