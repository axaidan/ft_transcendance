import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Profile, Ladder } from "./pages";
import ErrorPages from "./pages/ErrorPages";
import Welcomer from "./pages/Welcomer";

export default function App() {
	return (
		<div>
			<Routes>
				<Route path='/home' element={<Home />} />
				<Route path='/ladder' element={<Ladder />} />
				<Route path='/profile/:id' element={<Profile />} />
				<Route path='/' element={<Welcomer />} />
				<Route path='*' element={<ErrorPages mode={404} />} />
			</Routes>
		</div>
	);
}