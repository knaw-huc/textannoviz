import React from 'react'
import { Annotation } from "./components/annotation"
import { Text } from "./components/text"
import { Mirador } from "./components/MiradorInit"
//import { Viewer } from "./components/viewer"

export function App() {
	return (
		<div id='row'>
			<div id='mirador'>
				<Mirador />
			</div>
			<div id='text'>
				<Text />
			</div>
			<div id='annotation'>
				<Annotation />
			</div>
		</div>
	)
}