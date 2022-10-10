// Extern:
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'

// Intern:
import { AxiosJwt } from '../../hooks/AxiosJwt'
import { IUser } from '../../types';

// Assets:
import '../../styles/components/Settings.css'


function AvatarSettings() {
    const axios = AxiosJwt();

    const [ defaultPP, setDefaultPP ] = useState();
    const [ profilePicture, setProfilePicture ] = useState();

    // useEffect( () => {     
    //     axios.get( "/user/me" )
    //     .then( (res: AxiosResponse<IUser>) => {
    //         res.data.login
    //     })
    // }, [])

    const FileSelectHandler = (event: any) => {
        console.log( event.target.files[0] );
        setProfilePicture( event.target.files[0] );
    }

    const fileUploadHandler = (event: any) => {
        console.log( event );
    }

    return (
        <div>
            <div>
                <div>
                    <div className='img-ur-pp'></div>
                    <input type="file" onChange={FileSelectHandler} />
                </div>
                <div className='container-dfl-pp'>
                    <div className='img-dfl-pp'></div>
                    <div className='img-dfl-pp'></div>
                    <div className='img-dfl-pp'></div>
                </div>
            </div>
            <div>
                <button onClick={fileUploadHandler}>Commit</button>
            </div>
        </div>
    )
}

function UsernameSettings() {
    const axios = AxiosJwt();
    const [ username, setUsername ] = useState<string>('username');
    const [ newUsername, setNewUsername ] = useState<string>(); 

    useEffect( () => {     
        axios.get( "/user/me" )
        .then( (res: AxiosResponse<IUser>) => {
            setUsername(res.data.username);
        })
    }, [])

    const ChangeUsernameHandler = () => {
        axios.patch('/user')
        console.log("Username changed");
    }

    return (
        <div>
            <div>
                <input type="text" placeholder={username} onChange={ (e) => setNewUsername(e.target.value)}/>
                <button onClick={ChangeUsernameHandler}>Commit</button>
            </div>
        </div>
    )
}

export function Setting() {



    return (
        <div className='container-settings'>
            <div className='container-form-settings'>
                <AvatarSettings />
                <UsernameSettings />
            </div>
        </div>
    )
} 