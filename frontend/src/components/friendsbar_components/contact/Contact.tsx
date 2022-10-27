import React, { useContext, useEffect } from "react";
import { colorStatus, ContactStatus } from ".";
import { IUser } from "../../../types";

import '../../../styles/components/friendsbar_components/Contact.css'
import { ChatSocketContext } from "../../../context";

type ContactProps = { user: IUser, status: number };
export function Contact({ user, status }: ContactProps) {
	const {discussion} = useContext(ChatSocketContext).ChatSocketState;
	const notif: number = discussion[0]?.notif;

	// console.log(notif, '  ', discussion.find(disc => {disc.user1Id == user.id || disc.user2Id == user.id}) )

	return (
		<li className='contact-container'>
			<img src={user.avatarUrl} className="contact_icon" />
			<div className='contact-info'>
				<div id={colorStatus(status, 'username', notif ? true : false)} className="contact-name">
					{user.username}
				</div>
				<ContactStatus mode={status} />
			</div>
			{notif ?
			<div className='contact-notification'>
				{notif}
			</div> : <></>}
		</li>
	)
}
