// Extern:
import { PropsWithChildren, useContext, useEffect, useState } from "react";

// Intern:
import { ChatSocketContext, EChatSocketActionType } from "../../context";
import { AxiosJwt } from "../../hooks";
import { IChannel, IDiscussion, IUser } from "../../types";

export interface DiscLinkUserProps extends PropsWithChildren { index: number }
export const DiscLinkUser: React.FunctionComponent<DiscLinkUserProps> = ({ children, index }) => {
	const { index_active } = useContext(ChatSocketContext).ChatSocketState;
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	const UpDateActiveDiscusion = () => {
		if (index_active != index) {
			dispatch({ type: EChatSocketActionType.UP_CURR, payload: index });
		}
	}
	return (
		<div onClick={() => { UpDateActiveDiscusion() }}>
			{ children }
		</div>
	)
}

export interface UserCreateChatProps extends PropsWithChildren { user: IUser };
export const UserCreateChat: React.FunctionComponent<UserCreateChatProps> = ({ children, user }) => {
	const axios = AxiosJwt();
	const chat = useContext(ChatSocketContext).ChatSocketDispatch;
	const { discussion } = useContext(ChatSocketContext).ChatSocketState;

	const [newDisc, setNewDisc] = useState<IDiscussion>()

	useEffect(() => {
		if (!newDisc) { return; }
		let new_current = discussion.findIndex((elem) => elem.id === newDisc.id);
		if (new_current === -1)
		{
			discussion.push(newDisc); 
			chat({ type: EChatSocketActionType.UP_CURR, payload: discussion.length - 1 })
		}
		chat({ type: EChatSocketActionType.DISPLAY, payload: true })
	}, [newDisc])

	async function UpDateActiveDiscusion(uid: number) {
		const test: IDiscussion = (await axios.get('/discussion/user/' + uid)).data;
		if (!test) {
			const createdDiscussion = (await axios.post('/discussion', {user2Id: uid})).data;
			setNewDisc(createdDiscussion);
		} else { setNewDisc(test); }
	}

	return (
		<div onClick={() => { UpDateActiveDiscusion(user.id); }}>
			{ children }
		</div>
	);
}

