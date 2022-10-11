// Extern:
import React from "react";
import { Routes, Route } from "react-router-dom";

// Intern:
import { Profile, Ladder, Acceuil, ErrorPages, Welcomer, Home, Channel, Store } from "./pages";
import { MyNavProfile, OthNavProfile, History, Friends, Collection, Achievement } from "./componants";

export default function App() {
	return (
		<div>
			<Routes>
				<Route path='/'		element={ <Welcomer /> }/>
				<Route path='/home' element={ <Home /> }>
					<Route index		 element={ <Acceuil />}/>
					<Route path='ladder' element={ <Ladder />  }/>
					<Route path='me' element={ <MyNavProfile /> }>
						<Route index			 element={ <Profile /> }/>
						<Route path="history" element={ <History /> }/>
						<Route path="friend"	 element={ <Friends /> }/>
						<Route path="collection" element={ <Collection /> }/>
						<Route path="achievement" element={ <Achievement /> }/>
					</Route>
					<Route path=':id' element={ <OthNavProfile /> }>
						<Route index element={ <Profile /> }/>
						<Route path="history" element={ <History /> }/>
						<Route path="achievement" element={ <Collection /> }/>
					</Route>
					<Route path='channel' element={ <Channel /> }/>
					<Route path='store'	  element={ <Store />   }/>
				</Route>
				<Route path='*' element={<ErrorPages mode={404} />}/>
			</Routes>
		</div>
	);
}