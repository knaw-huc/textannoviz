import React from "react"
import { Link } from "react-router-dom"

export default function Home() {
    console.log(process.env.DTAP)
    return (
        <>
            <Link to="detail/volumes/1728/openings/285">TextAnnoViz - Republic</Link>
        </>
    )
}