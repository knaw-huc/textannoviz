import React, { useContext } from 'react';
import ann from '../data/ann1.json';
//import { MiradorInit } from './MiradorInit';
import { MirContext } from './MirContext';
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
    const store = useContext(MirContext);

    const action = () => {
        const act = mirador.actions.setCanvas('test', 'https://images.diginfra.net/api/pim/iiif/67533019-4ca0-4b08-b87e-fd5590e7a077/canvas/b64b5565-2945-4a18-8a4f-f25a0a26b6bd')
        store.dispatch(act);
    }

    return (
        <>
            <button onClick={action}>Next canvas</button>
            <ol>
                {ann.items.map(item => <li><code>{JSON.stringify(item, null, '\t')}</code></li>)}
            </ol>
        </>
    )

    //JSON.stringify(ann.items[0], null, 2);
}