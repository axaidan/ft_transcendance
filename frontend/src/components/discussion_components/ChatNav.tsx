import { Contact } from "..";
import { DflUser } from "../../types";

type ChatNavProps = { user: string }
export function ChatNav({ user }: ChatNavProps) {

	return (
		<div className='messages-nav'>
			{/* <Contact user={DflUser} status={0} /> */}
			<p>{user}</p>
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