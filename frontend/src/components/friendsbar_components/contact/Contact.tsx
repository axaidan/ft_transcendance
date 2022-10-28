// Extern:
import { useContext } from "react";

// Intern:
import { colorStatus, ContactStatus } from ".";
import { IUser } from "../../../types";
import { ChatSocketContext } from "../../../context";

import '../../../styles/components/friendsbar_components/Contact.css'



type NotificationProps = { notif: number };
export function Notification({ notif }:NotificationProps ) {
	return (( notif ? (<div className='contact-notification'>{notif}</div>) : (<></>)))
} 

type ContactProps = { user: IUser, status: number };
export function Contact({ user, status }: ContactProps) {
	const {discussion} = useContext(ChatSocketContext).ChatSocketState;
	const notif: number = discussion[0]?.notif;

	return (
		<li className='contact-container'>
			<img src={user.avatarUrl} className="contact_icon" />
			<div className='contact-info'>
				<div id={colorStatus(status, 'username', notif ? true : false)} className="contact-name">
					{user.username}
				</div>
				<ContactStatus mode={status} />
			</div>
			{/* <Notification notif={notif}/> */}
		</li>
	)
}
