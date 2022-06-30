import styled, { keyframes } from "styled-components"

const rotate360 = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`

export const Loading = styled.div`
    animation: ${rotate360} 1s linear infinite;
    transform: translateZ(0);

    border-top: 2px solid lightgrey;
    border-right: 2px solid lightgrey;
    border-bottom: 2px solid lightgrey;
    border-left: 4px solid #1967d2;

    background: transparent;

    width: 24px;
    height: 24px;
    border-radius: 50%;
`