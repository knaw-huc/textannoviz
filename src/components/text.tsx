//import text from '../data/attlist1text.json';
import React from 'react';
import { useContext } from 'react'
import { appContext } from '../state/context';

export function Text(): any {
    const { state } = useContext(appContext)

    return (
        <>
            {state.text ? state.text.join('\n') : 'Loading...'}
        </>
    )
}