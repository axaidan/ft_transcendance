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
		axios.get('/achiv/list_unlock/', user.id)
			.then((res) => setUnlocked(res.data));

		axios.get('/achiv/list_lock', user.id)
			.then((res) => setLocked(res.data));
	}, [])

	return (
		<div>
			<ul className='all_achiev'>
				{unlocked.map((achievment: IAchievment, index: number) => (
					<div className='unlocked_achiev' key={index}>
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
					locked.map((achievment: IAchievment, index: number) => (
						<div className='locked_achiev' key={index}>
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