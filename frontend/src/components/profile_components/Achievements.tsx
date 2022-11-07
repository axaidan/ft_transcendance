import { IUser } from '../../types/interfaces/IUser';
import { Navigate, useOutletContext, useNavigate } from 'react-router-dom';
import { AxiosJwt } from '../../hooks/AxiosJwt';
import { useState, useEffect } from 'react';
import { IAchievment } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import '../../styles/components/Achievements.css';
import { faArrowDownWideShort, faMugSaucer, faPoo, faTrophy } from '@fortawesome/free-solid-svg-icons';


export function Achievement() {

	let user: IUser = useOutletContext();
	const axios = AxiosJwt();
	const [unlocked, setUnlocked] = useState([]);
	const [locked, setLocked] = useState([]);

	useEffect(() => {
		axios.get('/achiv/list_unlock')
			.then((res) => setUnlocked(res.data));

		axios.get('/achiv/list_lock')
			.then((res) => setLocked(res.data));
	}, [])

	//let test: IconProp = 
	return (
		<div>
			<ul className='all_achiev'>
				{unlocked.map((achievment: IAchievment) => (
					<div className='unlocked_achiev'>
						<li >
							<h3>
								<FontAwesomeIcon icon={faTrophy} id='icon_unlocked' />
								{achievment.title}
							</h3>
							<div className="achiev_describe">
								{achievment.descriptions}
							</div>
						</li>
					</div>
				))}
				<br />
				{
					locked.map((achievment: IAchievment) => (
						<div className='locked_achiev'>
							<li id='locked-bloc'>
								<h3>
									<FontAwesomeIcon icon={faPoo} id='icon_locked' />
									{achievment.title}
								</h3>
								<div className="achiev_describe">
									{achievment.descriptions}
								</div>
							</li>
						</div>
					))}
			</ul>
		</div>
	)
}