import React, { useState } from 'react';

import { IUser } from '../types';

import '../styles/components/Friendsbar.css'
import '../styles/components/friendsbar_components/SocialOption.css'




// ICI ON AURA DU SOCKET A FAIRE! 
// pour les amis connecter


type FriendbarProps = {
	userId: number;
}


function SocialOption() {
	return (
		<div className='social-option'>
			<div>
				<p id="social-title">SOCIAL</p>
			</div>
			<div>
				<button id='social-add' className="social-btn"></button>
				<button id='social-sort' className="social-btn"></button>
				<button id='social-search' className="social-btn"></button>
			</div>
		</div>
	)
}

type OnlineFriendProps = {
	online_friends: IUser[];
}

function OnlineFriends({online_friends}:OnlineFriendProps) {
	return (
		<div>

		</div>
	)
}

export function Friendsbar({ userId }: FriendbarProps) {

	const [ onlineFriend, setOnlineFriend ] = useState([]);

	return (
		<div className='Friendsbar'>
			<SocialOption />
			<OnlineFriends online_friends={onlineFriend} />
		</div>
	);
};

export default Friendsbar;