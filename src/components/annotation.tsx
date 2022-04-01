import React, { useContext } from 'react';
import ann1 from '../data/attlist1ann1.json';
import ann2 from '../data/res17ann1.json';
import { appContext } from '../state/context';
import mirador from 'mirador';
import Elucidate from '../backend/Elucidate'

export function Annotation(): any {
    const { state } = useContext(appContext)
    
    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas('republic'))
        const currentState = state.store.getState()
        console.log(currentState)
        const result = fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
                let jpg = data.label
                console.log(jpg)
                const result = (Elucidate.getByJpg(jpg))
                return result
            })
        console.log(result)
        return result
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas('republic'))
    }

    const getCurrentCanvasId = () => {
        console.log(state.currentState)
        console.log(ann2)
    }

    return (
        <>
            <button onClick={nextCanvas}>Next canvas</button>
            <button onClick={previousCanvas}>Previous canvas</button>
            <button onClick={getCurrentCanvasId}>Get current canvas id</button>
            <ol>
                {
                    ann1.items.map((item, i) =>
                        <li key={i}>
                            <code>{JSON.stringify(item, null, '\t')}</code>
                        </li>
                    )}
            </ol>
        </>
    )
}

/*
function bodyValue(annotation: any): string {
    if (Array.isArray(annotation.body)) {
        const body = annotation.body.find((b: { value: string; }) => b.value);
        if (body) {
            return body.value;
        } else {
            throw new Error('No body id found in ' + JSON.stringify(annotation));
        }
    } else {
        return annotation.body.value;
    }
}
*/