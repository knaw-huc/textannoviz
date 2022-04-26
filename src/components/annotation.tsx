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

    const fetchData = async () => {
        state.store.dispatch(mirador.actions.setNextCanvas('republic'))
        const currentState = state.store.getState()
        console.log(currentState)
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(async data => {
                const jpg = data.label
                const ann = await Elucidate.getByJpg(jpg)
                //Hier moet een check ingebouwd worden of ann[0] wel bestaat.
                const versionId = getVersionId(ann[0].id)
                console.log(versionId)

                const scanPageFiltered: any[] = []
                ann.map((item: any) => {
                    if (item.body.value === 'scanpage') {
                        scanPageFiltered.push(item)
                    }
                })
                console.log(scanPageFiltered)

                const selectorTarget = findSelectorTarget(scanPageFiltered[0])

                const beginRange = selectorTarget.selector.start
                const endRange = selectorTarget.selector.end
                console.log(beginRange)
                console.log(endRange)
                const text = await TextRepo.getByVersionIdAndRange(versionId, beginRange, endRange)

                dispatch({
                    type: ACTIONS.SET_ANNO,
                    anno: ann
                })

                dispatch({
                    type: ACTIONS.SET_TEXT,
                    text: text
                })
            })
    }

    const nextCanvas = () => {
        fetchData()
    }

    const previousCanvas = () => {
        fetchData()
    }

    const testFunction = async () => {
        //console.log(state.currentState)
    }

    return (
        <>
            <button onClick={nextCanvas}>Next canvas</button>
            <button onClick={previousCanvas}>Previous canvas</button>
            <button onClick={testFunction}>Test button</button>
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


// function bodyValue(annotation: any): any {
//     return annotation.map((item: { body: any; }) => {
//         if (Array.isArray(item.body)) {
//             const body = item.body.find((b: { value: string; }) => b.value);
//             if (body) {
//                 return body.value;
//             } else {
//                 throw new Error('Bla');
//             }
//         } else {
//             return item.body.value;
//         }
//     });
//     // if (Array.isArray(annotation.body)) {
//     //     const body = annotation.body.find((b: { value: string; }) => b.value);
//     //     if (body) {
//     //         return body.value;
//     //     } else {
//     //         throw new Error('No body id found in ' + JSON.stringify(annotation));
//     //     }
//     // } else {
//     //     return annotation.body.value;
//     // }
// }