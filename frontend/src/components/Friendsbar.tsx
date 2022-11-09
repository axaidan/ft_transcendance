// Extern:
import React from 'react';

// Intern:
import { Chat, FooterFriendBar, FriendsList, HeaderFriendBar } from '.';

// Assets:
import '../styles/components/Friendsbar.css'
import { Channel } from './channel_components';

// ****************************************************************** //
// ***************            FRIENDBAR             ***************** //
// ****************************************************************** //

export function Friendsbar() {
	return (
		<div className='Friendsbar'>
			<HeaderFriendBar />
			<FriendsList />
			<FooterFriendBar />
			<Chat />
			<Channel />
		</div>
	);
};
