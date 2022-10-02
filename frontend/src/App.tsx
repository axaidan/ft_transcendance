import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./componants";
import { Home, Login } from "./pages";
import { Ladder } from "./pages/Ladder";

export default function App() {

	return (
		<div>
			<Navbar />
			<Routes>
				<Route path='/' element={ <Home />} />
				<Route path='/login' element={ <Login />} />
				<Route path='/ladder' element={ <Ladder />} />
			</Routes>

		</div>
	);
}
