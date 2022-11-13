import { IUser } from '../../types/interfaces/IUser';
import { Navigate, useOutletContext, useNavigate } from 'react-router-dom';
import { AxiosJwt } from '../../hooks/AxiosJwt';
import { useState, useEffect } from 'react';
import { IAchievment } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import '../../styles/components/Achievements.css';
import { faArrowDownWideShort, faAward, faEarthEurope, faExplosion, faFingerprint, faMartiniGlassCitrus, faMugSaucer, faPersonHarassing, faPodcast, faPoo, faQuestion, faSatelliteDish, faTrophy, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';


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

	const iconSwitcher = (path: string): IconProp => {
		switch (path) {
			case "fa-solid fa-earth-europe":
				return faEarthEurope;
			case "fa-solid fa-award":
				return faAward;
			case "fa-solid fa-question":
				return faQuestion;
			case "fa-solid fa-user-group":
				return faUserGroup;
			case "fa-solid fa-person-harassing":
				return faPersonHarassing;
			case "fa-solid fa-martini-glass-citrus":
				return faMartiniGlassCitrus;
			case "fa-regular fa-envelope":
				return faEnvelope;
			case "fa-solid fa-fingerprint":
				return faFingerprint;
			case "fa-solid fa-satellite-dish":
				return faSatelliteDish;
			case "fa-solid fa-podcast":
				return faPodcast;
			case "fa-solid fa-explosion":
				return faExplosion;
			case "fa-solid fa-trophy":
				return faTrophy;
		}
	};

	return (
		<div className='achiv-body'>
			<div className='collection-title'>ACHIEVEMENTS</div>
			<ul className='all_achiev'>
				{unlocked.map((achievment: IAchievment, index: number) => (
					<div className='unlocked_achiev' key={index}>
						<li >
							<h3>
								<FontAwesomeIcon icon={iconSwitcher(achievment.path)} id='icon_unlocked' />
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
									<FontAwesomeIcon icon={iconSwitcher(achievment.path)} id='icon_locked' />
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