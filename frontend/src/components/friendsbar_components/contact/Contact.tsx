// Extern:
import React from "react";

// Intern:
import { colorStatus, ContactStatus } from ".";
import { IUser } from "../../../types";

import '../../../styles/components/friendsbar_components/Contact.css'



type NotificationProps = { notif: number };
export function Notification({ notif }:NotificationProps ) {
	return (( notif ? (<div className='contact-notification'>{notif}</div>) : (<></>)))
} 

type ContactProps = { user: IUser, status: number };
export function Contact({ user, status }: ContactProps) {
	const notif: number = user.notif;

	return (
		<li className='contact-container'>
			<div className="chat-user-avatar">
				<img src={user.avatarUrl} className="chat-user-icon" />
			</div>
			<div className='contact-info'>
				<div id={colorStatus(status, 'username', notif ? true : false)} className="contact-name">
					<p>{user.username}</p>
				</div>
				<ContactStatus mode={status} />
			</div>
			<Notification notif={notif}/>
		</li>
	)
}
