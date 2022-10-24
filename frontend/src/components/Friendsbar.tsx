// Extern:
import React, { useEffect, useState } from 'react';

// Intern:
import SocketContextComponent from '../context/UserSocket/Components';
import { Chat, FooterFriendBar, FriendsList, HeaderFriendBar } from '.';
import { ChatSocketContextComponent } from '../context/ChatSocket/Components';

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
				<ChatSocketContextComponent userId={userId}>
					<HeaderFriendBar />
					<FriendsList />
					<FooterFriendBar />
					<Chat />
				</ChatSocketContextComponent>
			</SocketContextComponent>
		</div>
	);
};
