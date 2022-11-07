
// Assets:
import '../../styles/components/friendsbar_components/HeaderFriendBar.css'

export function HeaderFriendBar() {
	return (
		<div className='social-option'>
			<div>
				<p id="social-title">SOCIAL</p>
			</div>
			<div>
				<button id='social-add' className="social-btn"></button>
				<button id='social-sort' className="social-btn"></button>
				<button id='social-search' className="social-btn"></button>
			</div>
		</div>
	)
}