import React, { useContext } from 'react';
import { appContext } from '../state/context';
import mirador from 'mirador';
import Elucidate from '../backend/Elucidate'
import { ACTIONS } from '../state/actions';
import getVersionId from '../backend/utils/getVersionId'
import findSelectorTarget from '../backend/utils/findSelectorTarget'
import TextRepo from '../backend/TextRepo'

export function Annotation(): any {
    const { state, dispatch } = useContext(appContext)

    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas('republic'))
        const currentState = state.store.getState()
        console.log(currentState)
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(async data => {
                const jpg = data.label
                dispatch({
                    type: ACTIONS.SET_ANNO,
                    anno: await Elucidate.getByJpg(jpg)
                })
            })
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas('republic'))
        const currentState = state.store.getState()
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(async data => {
                const jpg = data.label
                dispatch({
                    type: ACTIONS.SET_ANNO,
                    anno: await Elucidate.getByJpg(jpg)
                })
            })
    }

    const getCurrentCanvasId = async () => {
        //console.log(state.currentState)
        const versionId = getVersionId(state.anno[0].id)
        console.log(versionId)
        const selectorTarget = findSelectorTarget(state.anno[0])
        console.log(selectorTarget)
        const scanPage = bodyValue(state.anno)
        console.log(scanPage)

        const scanPageFiltered: any[] = []
        state.anno.map((item: any) => {
            if (item.body.value === 'scanpage') {
                scanPageFiltered.push(item)
            }
        })
        console.log(scanPageFiltered)
        const beginRange = scanPageFiltered[0].target[0].selector.start
        const endRange = scanPageFiltered[0].target[0].selector.end
        console.log(beginRange)
        console.log(endRange)

        const text = await TextRepo.getByVersionIdAndRange(versionId, beginRange, endRange)
        console.log(text)

    }

    return (
        <>
            <button onClick={nextCanvas}>Next canvas</button>
            <button onClick={previousCanvas}>Previous canvas</button>
            <button onClick={getCurrentCanvasId}>Get current canvas id</button>
            <ol>
                {
                    state.anno ? state.anno.map((item: any, i: React.Key) => 
                    <li key={i}>
                        <code>
                            {JSON.stringify(item, null, '\t')}
                        </code>
                    </li>
                ) : 'Loading...' }
                    
            </ol>
        </>
    )
}


function bodyValue(annotation: any): any {
    return annotation.map((item: { body: any; }) => {
        if (Array.isArray(item.body)) {
            const body = item.body.find((b: { value: string; }) => b.value);
            if (body) {
                return body.value;
            } else {
                throw new Error('Bla');
            }
        } else {
            return item.body.value;
        }
    });
    // if (Array.isArray(annotation.body)) {
    //     const body = annotation.body.find((b: { value: string; }) => b.value);
    //     if (body) {
    //         return body.value;
    //     } else {
    //         throw new Error('No body id found in ' + JSON.stringify(annotation));
    //     }
    // } else {
    //     return annotation.body.value;
    // }
}