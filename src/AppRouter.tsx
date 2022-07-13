import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { App } from "./app"
import Home from "./components/Home"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="detail" element={<App />} />
                <Route path="*" element={<p>There is nothing here!</p>} />
            </Routes>
        </BrowserRouter>
    )
}