import React from "react"
import mirador from "mirador"
import { MirContext } from "./MirContext"

interface Props {
    config: any
    plugins: any
}

/*const miradorInstance = mirador.viewer({
    id: "mirador",
    windows: [{loadedManifest: "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest"}]
});
console.log(miradorInstance);*/

export function MiradorInit(props: Props) {
    const [store, setStore] = React.useState(null);

    React.useEffect(() => {
        //setViewer(mirador.viewer(props.config, props.plugins)); 
        const viewer = mirador.viewer(props.config, props.plugins)
        setStore(viewer.store);
        //console.log(viewer.store);
    }, [])

    console.log(store);

    return (
        <MirContext.Provider value={store}>
            <div id={props.config.id} />
        </MirContext.Provider>
    )
}

export function Viewer() {

    return (
        <div>
            <MiradorInit
                config={{
                    id: 'mirador',
                    window: {
                        allowFullscreen: false,
                        highlightAllAnnotations: true,
                        forceDrawAnnotations: true,
                    },
                    windows: [
                        {
                            loadedManifest: "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest",
                            canvasId: "https://images.diginfra.net/api/pim/iiif/67533019-4ca0-4b08-b87e-fd5590e7a077/canvas/75718d0a-5441-41fe-94c1-db773e0848e7",
                            id: "test",
                        },
                    ],
                    thumbnailNavigation: {
                        defaultPosition: 'far-bottom',
                    },
                    workspaceControlPanel: {
                        enabled: false,
                    }
                }}
                plugins={[]}
            />
        </div>
    )
}