
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Contact } from '..';
import { AxiosJwt } from '../../hooks';
import { IUser } from '../../types';


export function DiscussionNav() {

	const axios = AxiosJwt();
	const [onlineFriend, setOnlineFriend] = useState<IUser[]>([]);

	useEffect(() => {
		axios.get('/user/all')
			.then((res: AxiosResponse<IUser[]>) => { setOnlineFriend(res.data) });
	});

	return (
		<div className='discussion-container'>
			{onlineFriend.map((user: IUser, index) => (
				<Contact user={user} status={0} />
			))}
		</div>
	)
}
