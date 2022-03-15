import React from 'react';
import ann from '../data/ann1.json';

function Body(a: any): string {
    if (Array.isArray(a.body)) {
        const body = a.body.find((b: { id: string; }) => b.id);
        if (body) {
            return body.id;
        } else {
            throw new Error('No body id found in ' + JSON.stringify(a));
        }
    } else {
        return a.body.id;
    }
}

export function Annotation(): any {
    return (
        <ul>
            <li>id: <code>{JSON.stringify(ann.items[0].id, null, 2)}</code></li>
            <li>type: {Body(ann.items[0])}</li>
        </ul>
    )
    
    //JSON.stringify(ann.items[0], null, 2);
}