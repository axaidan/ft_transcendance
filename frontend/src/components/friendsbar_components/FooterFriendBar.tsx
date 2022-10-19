
import '../../styles/components/friendsbar_components/FooterFriend.css'

export function FooterFriendBar() {
	return (
		<div className="footer-friend">
			<button id='btn-footer-discussion' onClick={HandleClicReduction}></button>
			<button id='btn-footer-mission'></button>
			<button></button>
			<div><p> V12.19 </p></div>
			<button id='btn-footer-help'></button>
		</div>
	)
}

const HandleClicReduction = () => {
	const chatComponents = document.querySelector('#chat-container') as HTMLElement;
	if ( chatComponents.style.display == 'grid') {
		chatComponents.style.display = 'none';
	} else {
		chatComponents.style.display = 'grid';
	}
}