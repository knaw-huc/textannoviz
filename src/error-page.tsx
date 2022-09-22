import React from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

export const ErrorPage = () => {
    const error: any = useRouteError()
    console.error(error)

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <div>This page does not exist!</div>
        }
    }

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}