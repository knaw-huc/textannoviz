import React from "react"
import { appContext } from "./state/context"
import { useAppState } from "./state/reducer"

export const Providers = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal }) => {
    const [state, dispatch] = useAppState()

    return (
        <appContext.Provider value={{ state, dispatch }}>
            {props.children}
        </appContext.Provider>
    )
}