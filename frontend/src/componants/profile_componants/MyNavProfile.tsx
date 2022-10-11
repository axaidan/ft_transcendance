// Extern:
import React from 'react';
import { Outlet, useOutletContext, Link } from "react-router-dom";

// Intern:
import { IUser } from "../../types";

export function MyNavProfile() {

	const user: IUser = useOutletContext();

	return (
		<div>
			<nav>
				<Link to='/home/me'><button>Profile</button></Link>
				<Link to='/home/me/friend'><button>Friends</button></Link>
				<Link to='/home/me/history'><button>Historique</button></Link>
				<Link to='/home/me/collection'><button>Collection</button></Link>
				<Link to='/home/me/achievement'><button>Achievement</button></Link>
			</nav>
			<Outlet context={user} />
		</div>
	)
}
