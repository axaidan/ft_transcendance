// Extern:
import React from 'react';

// Intern:
import { Chat, FooterFriendBar, FriendsList, HeaderFriendBar } from '.';

// Assets:
import '../styles/components/Friendsbar.css'

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
		</div>
	);
};
