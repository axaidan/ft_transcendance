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

type ContactProps = { user: IUser, mode: boolean };
export function Contact({ user, mode }: ContactProps) {
	return (
		<li className='contact-container'>
			<div className="chat-user-avatar">
				<img src={user.avatarUrl} className="chat-user-icon" />
			</div>
			<div className='contact-info'>
				<div id={colorStatus(mode ? user.status : 4, 'username', false)} className="contact-name">
					<p>{user.username}</p>
				</div>
				<ContactStatus mode={mode ? user.status : 4} />
			</div>
		</li>
	)
}
