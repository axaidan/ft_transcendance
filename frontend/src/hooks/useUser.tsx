import { DflUser, IUser } from "../types";
import { useState, useEffect } from 'react';
import { AxiosJwt } from "./AxiosJwt";
import { AxiosResponse } from 'axios';

export const useUser = (id: string | undefined): IUser => {
	const axios = AxiosJwt();
	let user = DflUser;

	axios.get('/user/' + id)
		.then((res: AxiosResponse<IUser>) => { user = res.data })

	return user;
} 