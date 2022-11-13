// Extern:
import { useContext } from "react"
import { Link } from "react-router-dom";

// Intern:
import { IUser } from '../../types/interfaces/IUser';
import { AxiosJwt } from "../../hooks";
import { ESocketActionType, SocketContext } from '../../context/UserSocket/Socket';
import { UserCreateChat } from '../discussion_components/ChatUtils';

//Asset
import '../../styles/components/profile_components/Friends.css'
import '../../styles/pages/Ladder.css'


type FriendProps = {
	friend: IUser;
}


function FriendList({ friend }: FriendProps) {
	const axios = AxiosJwt();
	const dispatch = useContext(SocketContext).SocketDispatch;
	const { me } = useContext(SocketContext).SocketState;

	const RemoveFriend = (cibleId: number) => {
		axios.post('/relation/remove_friend/' + cibleId);
		dispatch({ type: ESocketActionType.RM_FRIENDS, payload: friend });
	}

	const BlockFriend = (cibleId: number) => {
		axios.post('/relation/block_user/' + cibleId);
		dispatch({ type: ESocketActionType.ADD_BLOCKS, payload: friend });
		dispatch({ type: ESocketActionType.RM_FRIENDS, payload: friend });
		axios.post('/achiv/unlock', { userId: me.id, achivId: 5 });
		location.reload();
	}

	return (
		<div className="friend-bloc">

			<img src={friend.avatarUrl} id='friend-avatar' />
			<div className="friend-username">
				{friend.username}
			</div>
			<Link to={"/home/" + friend.id}>
				<button id='friend-redirect'>
				</button>
			</Link>
			<div className="friend-right-button">
				<UserCreateChat user={friend}>
					<button id='friend-chat'></button>
				</UserCreateChat>
				<button id='friend-unfriend' onClick={() => RemoveFriend(friend.id)}></button>
				<button id='friend-blockit' onClick={() => BlockFriend(friend.id)}></button>
			</div>
		</div>
	)
}

function BlockList({ friend }: FriendProps) {
	const axios = AxiosJwt();
	const dispatch = useContext(SocketContext).SocketDispatch

	const IsFriend = async (cibleId: number): Promise<boolean> => {
		return (await axios.get('/relation/is_friend/' + cibleId)).data;
	}

	const RemoveBlock = async (cibleId: number) => {
		axios.post('/relation/unblock_user/' + cibleId)
		dispatch({ type: ESocketActionType.RM_BLOCKS, payload: friend });
		if (await IsFriend(cibleId) === true)
			dispatch({ type: ESocketActionType.ADD_FRIENDS, payload: friend });
		location.reload();
	}

	return (
		<div className="friend-bloc">
			<img src={friend.avatarUrl} id='friend-avatar' />
			<div className="friend-username">
				{friend.username}
			</div>
			<div className="friend-right-button">
				<button id='friend-unblock' onClick={() => RemoveBlock(friend.id)} />
			</div>
		</div>
	)
}



export function Friends() {
	const { me, friends, blocks } = useContext(SocketContext).SocketState;


	return (
		<div className="friends-body">
			<ul className="friend-friend-div">
				<h1>{me.username}'s friendlist :</h1>
				{friends.map((friend: IUser, index: number) => (
					<FriendList key={index} friend={friend} />
				))}
			</ul>

			<ul className="friend-block-div">
				<h1>{me.username}'s blocklist :</h1>
				{blocks.map((block: IUser, index: number) => (
					<BlockList key={index} friend={block} />
				))}
			</ul>
		</div>
	)
}