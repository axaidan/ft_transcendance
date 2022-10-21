import { AxiosResponse } from "axios";
import { useContext, useEffect, useReducer, useState} from "react";
import { Socket } from "socket.io-client";
import { ChatNav, DiscussionNav } from ".";
import { SocketContext } from "../../context";
import { ChatSocketContext } from "../../context/ChatSocket";
import { AxiosJwt } from "../../hooks";

import '../../styles/components/discussion_components/Chat.css'
import { dflDiscussion, DflUser, IDiscussion, IMessage, IUser } from "../../types";


export function ChatBody() {

	// LISTE DES DISCUSSIONS SUR LE COTE
	// const discussion: Discussion[] = axios.get('/discussion');

	//  A L'OUVERTURE D'UNE FENETRE
	// const messages: DiscussionMessage[] = axios.get('/discussion/discussion[i].id');

	// DANS LA STATE
	// - 1 DiscussionMessage
	//	QUI CHANGE DES QUE JE RECOIS 'discMsgToClient'

	return (
		<div className='messages-body'>
			<div>
				awdawdawaw
			</div>
		</div>
	)
}

type ChatProps = { userDisc: number }
export function Chat({ userDisc }: ChatProps) {

	const { uid } = useContext(SocketContext).SocketState;


	/* Permet d'envoyer le message au back - dans le cas ou l'input nest pas vide */
	const handleKeyDown = ( e: any ) => {
		const input = document.getElementById('messages-input') as HTMLInputElement;
		if ( e.key === 'Enter') {
			if (input.value.length != 0) {
				console.log('uid ', uid, " to did " , "" , " : ", input.value);
				// ICI je doit emit le message au back!
				// il me faut donc: - socket - userId - input.value - discId

			} else { console.log('input is empty'); }
			// Flush du contenu d'input:
			input.value = "";
		}
	}

	return (
		<div id="chat-container">
			<DiscussionNav />
			<div className='messages-container'>
				<ChatNav />
				<ChatBody />
				<input	id="messages-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown}/>
			</div>
		</div>
	)
}
