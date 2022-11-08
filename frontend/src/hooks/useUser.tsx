import { DflUser, IUser } from "../types";
import { useState, useEffect } from 'react';
import { AxiosJwt } from "./AxiosJwt";
import { AxiosResponse } from 'axios';

export const useUser = (id: string): IUser => {
	const axios = AxiosJwt();
	const [user, setUser] = useState<IUser>(DflUser);

	useEffect(() => {
		axios.get('/user/' + id)
			.then((res: AxiosResponse<IUser>) => { setUser(res.data); })
	}, [user]);

	return user;
} 