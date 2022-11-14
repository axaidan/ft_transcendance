// Extern:
import React, { useContext } from 'react';

// Intern:
import { Chat, FooterFriendBar, FriendsList, HeaderFriendBar } from '.';
import { SocketContext } from '../context';

// Assets:
import '../styles/components/Friendsbar.css'
import { Channel } from './channel_components';

// ****************************************************************** //
// ***************            FRIENDBAR             ***************** //
// ****************************************************************** //

export function Friendsbar() {
	const { disable } = useContext(SocketContext).SocketState;


	return (
		<div className={ disable ? 'disabled-nav' : 'Friendsbar'}>
			<HeaderFriendBar />
			<FriendsList />
			<FooterFriendBar />
			<Chat />
			<Channel />
		</div>
	);
};
