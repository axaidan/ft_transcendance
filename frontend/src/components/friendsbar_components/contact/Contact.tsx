import React from "react";
import { colorStatus, ContactStatus } from ".";
import { IUser } from "../../../types";

import '../../../styles/components/friendsbar_components/Contact.css'

type ContactProps = { user: IUser, status: number };
export function Contact({ user, status }: ContactProps) {

	// CECI SERA DONNE GRACE AU SOCKET STATUS
	const notif: number = 0;

	return (
		<li className='contact-container'>
			<img src='https://2.bp.blogspot.com/-sT67LUsB61k/Ul7ocxgFhTI/AAAAAAAACdc/iAQ2LgxMvG4/s1600/image+115.jpg' className="contact_icon" />
			<div className='contact-info'>
				<div id={colorStatus(status, 'username', notif ? true : false)} className="contact-name">
					{user.username}
				</div>
				<ContactStatus mode={status} />
			</div>
			{notif ?
				<div className='contact-notification'>
					{notif}
				</div> : <></>
			}
		</li>
	)
}
