import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./componants";
import { Home, Login, Profile, Ladder } from "./pages";

export default function App() {

	return (
		<div>
			<Navbar />
			<Routes>
				<Route path='/' element={ <Home />} />
				<Route path='/login' element={ <Login />} />
				<Route path='/ladder' element={ <Ladder />} />
				<Route path='/profile/:id' element={ <Profile />} />
			</Routes>
		</div>
	);
}