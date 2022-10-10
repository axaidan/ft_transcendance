import { ErrorProps } from '../types'

function ErrorPages({ mode }: ErrorProps) {

	return (
		<div>
			<h1>ERROR {mode} </h1>
		</div>
	)

}

export default ErrorPages;