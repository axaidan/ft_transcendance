import React, { useEffect, useState } from "react"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCookies } from "react-cookie";

export function useAxios<T>(config: AxiosRequestConfig<any>, loadOnStart: boolean = true): [boolean, T | undefined, string, () => void ] {
    const [loading, setLoading ] = useState<boolean>(true);
    const [data, setData] = useState<T>();
    const [error, setError] = useState<string>('');

    //  SET UP COOKIE IN THE CONFIG  //
	const [ cookies ] = useCookies();
	const jwtToken = cookies.access_token;
	const API_URL = "http://localhost:3000" // A CHANGER EN VAR ENV
    const defaultOptions = {
        headers: {
            Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
        },
    };
    // ----------------------------- //

    useEffect(() => {
        if (loadOnStart) sendRequest();
        else setLoading(false);
    }, []);

    const request = () => {
        sendRequest();
    }

    const sendRequest = () => {
        setLoading(true);

        axios( API_URL + config.url, {...defaultOptions, ...config })
        .then(( res: AxiosResponse<any> ) => {
            setError('');
            setData(res.data);
        })
        .catch((error) => {
            setError(error.message);
        })
        .finally(() => setLoading(false));
    };

    return [loading, data, error, request];
}