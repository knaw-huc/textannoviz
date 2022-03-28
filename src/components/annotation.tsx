import React, { useContext } from 'react';
import ann from '../data/ann1.json';
//import { MiradorInit } from './MiradorInit';
import { appContext } from '../state/context';
import mirador from 'mirador';

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

export function Annotation(): any {
    const { state } = useContext(appContext);

    const nextCanvas = () => {
        const action = mirador.actions.setNextCanvas('republic');
        state.store.dispatch(action);
    }

    const previousCanvas = () => {
        const action = mirador.actions.setPreviousCanvas('republic');
        state.store.dispatch(action);
    }

    const getCurrentCanvasId = () => {
        const currentCanvasId = mirador.selectors.getCurrentCanvas();
        //console.log(currentCanvasId);
        return currentCanvasId;
    }

    return (
        <>
            <button onClick={nextCanvas}>Next canvas</button>
            <button onClick={previousCanvas}>Previous canvas</button>
            <button onClick={getCurrentCanvasId}>Get current canvas id</button>
            <ol>
                {
                    ann.items.map((item, i) =>
                        <li key={i}>
                            <code>{JSON.stringify(item, null, '\t')}</code>
                        </li>
                    )}
            </ol>
        </>
    )

    //JSON.stringify(ann.items[0], null, 2);
}