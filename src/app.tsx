import React from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router-dom"
import { Detail } from "./Detail"
import Home from "./components/Home"

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <Home />
//     },
//     {
//         path: "detail/volumes/:volume/openings/:context*",
//         element: <Detail />,
//         errorElement: <h2>Opening not found</h2>
//     },
//     {
//         path: "detail/resolutions/:resolutionId*",
//         element: <Detail />,
//         errorElement: <h2>Resolution not found</h2>
//     }
// ])

const router = createBrowserRouter(
    createRoutesFromElements(
        <Routes>
            <Route
                key="Home"
                path="/"
                element={<Home />}
            />
            {["detail/volumes/:volume/openings/:context*", "detail/resolutions/:resolutionId*"].map(path => (
                <Route
                    key="Detail"
                    path={path}
                    element={<Detail />}
                />
            ))}
        </Routes>

    )
)

export default function App() {
    return <RouterProvider router={router} />
}