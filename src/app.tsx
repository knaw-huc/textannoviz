import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Detail } from "./Detail"
import Home from "./components/Home"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "detail/volumes/:volume/openings/:context",
        element: <Detail />,
        errorElement: <h2>Opening not found</h2>
    },
    {
        path: "detail/resolutions/:resolutionId",
        element: <Detail />,
        errorElement: <h2>Resolution not found</h2>
    }
])

export default function App() {
    return <RouterProvider router={router} />
}