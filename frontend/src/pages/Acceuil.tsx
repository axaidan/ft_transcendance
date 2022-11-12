//ASSETS
import '../styles/pages/Acceuil.css'
import accueilbg from '../assets/videos/accueil-bg.webm'
import { useContext, useEffect } from 'react';
import { AxiosJwt } from '../hooks/AxiosJwt';
import { SocketContext } from '../context';

export function Acceuil() {

	const axios = AxiosJwt();
	const { me } = useContext(SocketContext).SocketState;

	useEffect(() => {
		axios.post('/achiv/unlock', { userId: me.id, achivId: 1 });
	}, [])

	return (
		<div className='acc-body'>
			<div id='acc-title'>The 13th season is coming !</div>
			<div className='acc-video-div'>
				<video src={accueilbg} playsInline autoPlay loop muted className='acc-video' />
			</div>
			<div className="acc-notes">

				<div className='acc-worlds'>
					<a href='https://www.youtube.com/watch?v=UUhjpTuZunw'>
						<img src='https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt481add8b70ff4bd9/634f52cbbb329010566dee4e/Top10-YT-Template-Faker.jpg' id='acc-faker' />
						<div className="acc-faker-desc">
							<div className="acc-esport">E-SPORT</div>
							<div className='acc-esport-title'>Group Stage Top 10 !</div>
							<div className='acc-esport-desc'>A look back at the best moves from the group stage.</div>
							<div className='acc-esport-publish'>Lolesports Staff - 8 days ago.</div>
						</div>
					</a>
				</div>
				<div className='acc-patch'>
					<a href='https://www.leagueoflegends.com/fr-fr/news/game-updates/patch-12-20-notes/'>
						<img src='https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt7251f20c96249085/5dc1c1b3a7387b0187ebe112/lol_promoart_15_0.jpg' id='acc-faker' />
						<div className="acc-faker-desc">
							<div className="acc-esport">NEWS</div>
							<div className='acc-esport-title'>12.20 Patch Notes</div>
							<div className='acc-esport-publish'>Riot Riru - last week - 8 days ago.</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	)
}
