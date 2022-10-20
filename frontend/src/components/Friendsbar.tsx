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

	const [ activeDisc, setActiveDisc ] = useState<number>(0);
	const updateDisc = (disc:number): void => {
		setActiveDisc(disc);
	}

	useEffect(() => {
		console.log("disc active: " + activeDisc);
	}, [activeDisc]);

	return (
		<div className='Friendsbar'>
			<SocketContextComponent userId={userId}>
				<HeaderFriendBar />
				<FriendsList setDisc={updateDisc} />
				<FooterFriendBar />
				{/* <ChatSocketContextComponent userId={userId}> */}
					<Chat userDisc={activeDisc}/>
				{/* </ChatSocketContextComponent> */}
			</SocketContextComponent>
		</div>
	);
};
