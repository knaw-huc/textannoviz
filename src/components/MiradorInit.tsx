import React from "react"
import Mirador from "mirador"

interface Props {
    config: any
    plugins: any
}

export function MiradorInit(props: Props) {
    React.useEffect(() => {
        Mirador.viewer(props.config, props.plugins)
    }, [])

    return <div id={props.config.id} />
}
