import { useContext } from "react";
import { SocketContext } from "../context";
import { AxiosJwt } from "./AxiosJwt";

const axios = AxiosJwt();
const { me } = useContext(SocketContext).SocketState;

export const hasAchiev = (id: string) => {
	let ret = false;

	axios.get('/achiv/findAchivForUser/', { userId: me.id.toString(), achivId: id })
		.then((res) => ret = res.data);
	return ret;
}