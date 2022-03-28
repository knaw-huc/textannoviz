import React from 'react'
import { Annotation } from "./components/annotation"
import { Text } from "./components/text"
import { Mirador } from "./components/mirador"
import { useAppState } from './state/reducer'
import { appContext } from './state/context'

export function App() {
	const [state, dispatch] = useAppState()

	return (
		<appContext.Provider value={{ state, dispatch }}>
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
		</appContext.Provider>
	)
}