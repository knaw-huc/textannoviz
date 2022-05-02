import React, { useContext } from 'react';
import { appContext } from '../state/context';
import mirador from 'mirador';
import Elucidate from '../backend/Elucidate'
import { ACTIONS } from '../state/actions';
import getVersionId from '../backend/utils/getVersionId'
import findSelectorTarget from '../backend/utils/findSelectorTarget'
import TextRepo from '../backend/TextRepo'
import getBodyValue from '../backend/utils/getBodyValue'

export function Annotation(): any {
    const { state, dispatch } = useContext(appContext)

    const fetchData = async () => {
        const currentState = state.store.getState()
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(async data => {
                const jpg = data.label
                const ann = await Elucidate.getByJpg(jpg)
                if (ann[0]) {
                    const versionId = getVersionId(ann[0].id)

                    const scanPageFiltered: any[] = []
                    const annFiltered: any[] = []
                    ann.map((item: any) => {
                        if (item.body.value === 'scanpage') {
                            scanPageFiltered.push(item)
                        }
                        if (getBodyValue(item) != 'line' && 'column') {
                            annFiltered.push(item)
                        }
                    })
                    console.log(annFiltered)
                    console.log(scanPageFiltered)

                    const selectorTarget = findSelectorTarget(scanPageFiltered[0])
                    const beginRange = selectorTarget.selector.start
                    const endRange = selectorTarget.selector.end
                    const text = await TextRepo.getByVersionIdAndRange(versionId, beginRange, endRange)

                    dispatch({
                        type: ACTIONS.SET_ANNO,
                        anno: annFiltered
                    })

                    dispatch({
                        type: ACTIONS.SET_TEXT,
                        text: text
                    })
                } else {
                    return
                }
            })
    }

    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas('republic'))
        fetchData()
            .catch(console.error)
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas('republic'))
        fetchData()
            .catch(console.error)
    }

    const testFunction = async () => {
        //console.log(state.currentState)
        const boxToZoom = {
            x: 1420,
            y: 1831,
            width: 800,
            height: 1195
        };

        const zoomCenter = {
            x: boxToZoom.x + boxToZoom.width / 2,
            y: boxToZoom.y + boxToZoom.height / 2
        };
        const action = mirador.actions.updateViewport('republic', {
            x: zoomCenter.x,
            y: zoomCenter.y,
            zoom: 1 / boxToZoom.width
        });

        state.store.dispatch(action);
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