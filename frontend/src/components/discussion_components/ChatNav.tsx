import { Contact } from "..";
import { DflUser } from "../../types";

type ChatNavProps = { user1: string }
export function ChatNav({ user1 }: ChatNavProps) {

	return (
		<div className='messages-nav'>
			{/* <Contact user={DflUser} status={0} /> */}
			<p>{user1}</p>
			<div className='messages-options'>
				<button id='btn-messages-reduction' onClick={HandleClicReduction}></button>
				<button id='btn-messages-panel'></button>
			</div>
		</div>
	)
}

function HandleClicReduction() {
	const chatComponents = document.querySelector('#chat-container') as HTMLElement;
	chatComponents.style.display = 'none';
}