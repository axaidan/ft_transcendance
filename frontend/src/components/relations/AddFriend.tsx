import { useContext } from "react";
import { ESocketActionType, SocketContext } from "../../context";
import { AxiosJwt } from "../../hooks";
import { IUser } from "../../types";

export function AddFriend(user: IUser) {

	const axios = AxiosJwt();
	const { me, friends, blocks } = useContext(SocketContext).SocketState;
	const dispatch = useContext(SocketContext).SocketDispatch

	const Add = async (user: IUser) => {
		await axios.post('/relation/add_friend/' + user.id);
		dispatch({ type: ESocketActionType.ADD_FRIENDS, payload: user });
	}

	return (
		<button onClick={() => Add(user)} >Add</button>
	)
}