// Extern:
import React from 'react';

// Intern:
import SocketContextComponent from '../context/UserSocket/Components';
import { Chat, FooterFriendBar, FriendsList, HeaderFriendBar } from '.';

// Assets:
import '../styles/components/Friendsbar.css'

// ****************************************************************** //
// ***************            FRIENDBAR             ***************** //
// ****************************************************************** //

type FriendbarProps = { userId: number; }
export function Friendsbar({ userId }: FriendbarProps) {

	return (
		<div className='Friendsbar'>
			<SocketContextComponent userId={userId}>
				<HeaderFriendBar />
				<FriendsList />
				<FooterFriendBar />
				<Chat />
			</SocketContextComponent>
		</div>
	);
};
