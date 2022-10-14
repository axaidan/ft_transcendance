import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<CookiesProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</CookiesProvider>
)
