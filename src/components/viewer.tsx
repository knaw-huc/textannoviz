import MiradorInit from "./MiradorInit";
import React from "react";

function Viewer() {
    return (
        <div>
            <MiradorInit
                config={{
                    id: 'mirador',
                    window: {
                        sideBarPanel: 'info',
                        sideBarOpen: true
                    },
                    windows: [
                        {
                            loadedManifest: "https://e-codices.unifr.ch/metadata/iiif/csg-0278/manifest.json",
                        },
                    ],
                }}
                plugins={[]}
            />
        </div>
    )
}

export default Viewer;