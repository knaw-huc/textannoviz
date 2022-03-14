import React from "react";
import { MiradorInit } from "./MiradorInit";
import './viewer.css';

export function Viewer() {
    return (
        <div id="mirador">
            <MiradorInit
                config={{
                    id: 'mirador',
                    window: {
                        allowFullscreen: false,
                    },
                    windows: [
                        {
                            loadedManifest: "https://e-codices.unifr.ch/metadata/iiif/csg-0278/manifest.json",
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
