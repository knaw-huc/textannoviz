import React from 'react'
import styled, { keyframes } from 'styled-components'

export function App() {
	return (
		<AppWrapper>
			Go Sebastiaan! Go Sebastiaan!
		</AppWrapper>
	)
}

const grow = keyframes`
	0% {
		transfrom: scale(1);
	}

	50% {
		transform: scale(5);
	}
`

const AppWrapper = styled.div`
	align-content: center;
	background: red;
	color: yellow;
	display: grid;
	font-weight: bold;
	height: 100vh;
	justify-content: center;
	margin: 0;
	padding: 0;
	text-align: center;
	width: 100vw;

	animation: ${grow} 1s ease-out infinite;
`