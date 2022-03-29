import React, { useContext } from 'react';
import ann1 from '../data/attlist1ann1.json';
import ann2 from '../data/res17ann1.json';
import { appContext } from '../state/context';
import mirador from 'mirador';

export function Annotation(): any {
    const { state } = useContext(appContext)

    const nextCanvas = () => {
        const action = mirador.actions.setNextCanvas('republic')
        state.store.dispatch(action)
        const currentState = state.store.getState()
        console.log(currentState)
        // Fetch current canvasid
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data)
                //wat is de .jpg van het plaatje dat nu in Mirador getoond wordt?
                let jpg = data.label
                console.log(jpg)
                //wat zijn de .jpg's in de annotatie data? Data is nog niet altijd juist, want hij geeft soms 'https://example.org/missing-iiif-url', terwijl er onder target[2] dan wel de juiste link zit
                let jpgAnn = ann2.items.map((item) => {
                    return item.target[1].source
                })
                console.log(jpgAnn)

                //ga over alle .jpg's in de annotatie data heen
                jpgAnn.map((item) => {
                    console.log(item)
                    //zit de .jpg van Mirador in de .jpg's van de annotaties? Zo ja, dan zou hij die annotaties moeten laten zien in de rechterkolom. Zo nee, dan moet hij lekker niets doen
                    if (item.includes(jpg)) {
                        console.log('yes')
                    } else {
                        console.log('no')
                    }
                })
            })
    }

    //dit komt uit micro-annotator en diende ter inspiratie
    /*
    async function nextQuick() {
        const allPagesList = await Elucidate.getPageList(15);
  
        const listIds = [];
        for (let i = 0; i < allPagesList.length; i += 1) {
          const ids = findBodyId(allPagesList[i]);
          if (ids.includes('meeting')) {
            console.log(ids);
            console.log(i);
            listIds.push(ids);
          }
        }
        const sortedIds = listIds.sort();
        console.log(sortedIds);
  
        for (let i = 0; i < sortedIds.length; i += 1) {
          console.log(sortedIds[i]);
          if (annId === sortedIds[i]) {
            console.log('ja');
            console.log(sortedIds.length);
            if (i >= sortedIds.length - 1) {
              console.log('Reached end of ids');
              return;
            } else {
              console.log(i);
              const nextAnn = sortedIds[i + 1];
              console.log(nextAnn);
              navigate(`/annotation/${nextAnn}`);
            }
          } else {
            console.log('nee');
          }
        }
      }*/

    const previousCanvas = () => {
        const action = mirador.actions.setPreviousCanvas('republic')
        state.store.dispatch(action)
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