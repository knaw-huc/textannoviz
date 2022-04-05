import React, { useContext } from 'react';
import { appContext } from '../state/context';
import mirador from 'mirador';
import Elucidate from '../backend/Elucidate'

export function Annotation(): any {
    const { state } = useContext(appContext)
    const [anno, setAnno] = React.useState(null)

    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas('republic'))
        const currentState = state.store.getState()
        console.log(currentState)
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(async data => {
                let jpg = data.label
                setAnno(await Elucidate.getByJpg(jpg))
            })
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas('republic'))
    }

    const getCurrentCanvasId = () => {
        //console.log(state.currentState)
        console.log(anno)
    }

    return (
        <>
            <button onClick={nextCanvas}>Next canvas</button>
            <button onClick={previousCanvas}>Previous canvas</button>
            <button onClick={getCurrentCanvasId}>Get current canvas id</button>
            <ol>
                {
                    anno ? anno.map((item: any, i: React.Key) => 
                    <li key={i}>
                        <code>
                            {JSON.stringify(item, null, '\t')}
                        </code>
                    </li>
                ) : 'test' }
                    
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