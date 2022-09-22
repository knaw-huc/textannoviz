import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./components/Home"
import { Detail } from "./Detail"
import { ErrorPage } from "./error-page"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            
        ]
    },
    {
        path: "detail/volumes/:volume/openings/:context",
        element: <Detail />,
        errorElement: <ErrorPage />
    },
    {
        path: "detail/resolutions/:resolutionId",
        element: <Detail />,
        errorElement: <ErrorPage />
    }
])

export default function App() {
    return <RouterProvider router={router} />
}