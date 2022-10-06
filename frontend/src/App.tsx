import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./componants";
import { Home, Login, Profile, Ladder } from "./pages";
import Test from './pages/Test';
import Friendsbar from './componants/Friendsbar';

export default function App() {

	return (
		<div>
			<Navbar />
			<Friendsbar />
			<Routes>
				<Route path='/' element={<Test />} />
				<Route path='/login' element={<Login />} />
				<Route path='/ladder' element={<Ladder />} />
				<Route path='/profile/:id' element={<Profile />} />
				<Route path='*' element={<Home />} />
			</Routes>
		</div>
	);
}