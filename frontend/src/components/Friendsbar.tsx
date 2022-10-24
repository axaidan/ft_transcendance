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


// ****************************************************************** //
// *******      BIENTOT DELETE -> GERER DANS LE CONTEXT      ******** //
// ****************************************************************** //
	const [ activeDisc, setActiveDisc ] = useState<number>(0);

	// Pour le type de la fonction passer a l'enfant
	const updateDisc = (disc:number): void => {
		setActiveDisc(disc);
	}

	useEffect(() => {
		console.log("disc active: " + activeDisc);
	}, [activeDisc]);

// ****************************************************************** //


	return (
		<div className='Friendsbar'>
			<SocketContextComponent userId={userId}>
				<ChatSocketContextComponent userId={userId}>
					<HeaderFriendBar />
					<FriendsList setDisc={updateDisc} />
					<FooterFriendBar />
					<Chat userDisc={activeDisc} />
				</ChatSocketContextComponent>
			</SocketContextComponent>
		</div>
	);
};
