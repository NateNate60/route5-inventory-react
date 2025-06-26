"use client"

import "@/css/style.css"
import "./manage.css"
import BackButton from "@/components/buttons/backbutton"
import UserManagement from "./UserManagement"
import { useEffect } from "react"
import { refreshToken } from "@/backend/login"
import UPCManagement from "./UPCManagement"
import PriceManagement from "./PriceManagement"

export default function ManagePage () {
    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    return (

        <div>
            <BackButton/>
            <div id="main-interface">
                <h1 id="page-title">Management</h1>
                <UserManagement/>
                <UPCManagement/>
                <PriceManagement/>
            </div>
        </div>
    )
}