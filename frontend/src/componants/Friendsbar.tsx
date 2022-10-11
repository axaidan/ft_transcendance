import React from 'react';
import '../styles/components/Friendsbar.css'
import PropTypes from "prop-types"


// ICI ON AURA DU SOCKET A FAIRE! 
// pour les amis connecter


type FriendbarProps = {
	userId: number;
}

export function Friendsbar({ userId }:FriendbarProps ) {


	return (
		<nav className='Friendsbar'>
			<p color="black" > {userId} </p>
		</nav>
	);
};
