import React from 'react';
import '../styles/components/Friendsbar.css'

type FriendbarProps = {
	userId: number;
}

export function Friendsbar({ userId }:FriendbarProps ) {
	return (
		<nav className='Friendsbar'>
			{userId}
		</nav>
	);
};
