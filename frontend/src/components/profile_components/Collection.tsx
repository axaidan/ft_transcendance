import React, { useState, useEffect, useContext } from 'react';

//CONTEXT
import { SocketContext } from '../../context';

//CUSTOM HOOK
import { AxiosJwt } from '../../hooks';

//INTERFACE
import { IAvatar } from '../../types';

//ASSETS
import '../../styles/components/profile_components/Collection.css'
import { Outlet } from 'react-router-dom';

export function Collection() {

	const axios = AxiosJwt();
	const { me } = useContext(SocketContext).SocketState;
	const [avatars, setAvatars] = useState<IAvatar[]>([]);

	const handleImageUpload = async (event: any) => {
		event.preventDefault();
		const file = event.currentTarget["fileInput"].files[0];

		const formData = new FormData();
		formData.append("file", file);

		await axios.postfile('/avatar/upload_public/', formData)
			.then((res) => {
				axios.post('/achiv/unlock', { userId: me.id, achivId: 9 });
				location.reload();
			})
			.catch((error) => {
				console.error(error);
			});
	};

	useEffect(() => {
		axios.get('/avatar/list').then((res) => { setAvatars(res.data) })
	}, [])

	const changeAvatar = (id: number) => {
		axios.postfile('/avatar/update_avatar/' + id)
			.then((res) => {
				location.reload();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	return (
		<div className='collection-body'>
			<div className="collection-title">
				AVATARS
			</div>
			<div className="collection-avatar-list">
				{avatars.map((avatar: IAvatar, index) =>
					<div key={index} className='collection-avatars'>
						<img onClick={() => changeAvatar(avatar.id)} src={avatar.url} id={me.avatarUrl === avatar.url ? 'collection-current-avatar' : 'collection-avatar-map'} />
					</div>
				)}
				<form onSubmit={handleImageUpload} className='collection-upload'>
					<label className='collection-inputFile'>
						<input id="fileInput" type="file" />
					</label>
					<input type="submit" id='collection-submit' value="Valider" />
				</form>
			</div>
		</div>
	)
}