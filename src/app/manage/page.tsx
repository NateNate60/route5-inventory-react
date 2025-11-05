"use client"

import "@/css/style.css"
import "./manage.css"
import BackButton from "@/components/buttons/backbutton"
import UserManagement from "./UserManagement"
import { useEffect, useState } from "react"
import { checkAccessValidity, refreshToken } from "@/backend/login"
import UPCManagement from "./UPCManagement"
import PriceManagement from "./PriceManagement"
import RateManagement from "./RateManagement"

export default function ManagePage () {
    useEffect( () => {
        refreshToken()
        checkAccessValidity().then( (value) => setOrg(value.org))
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const [org, setOrg] = useState<string>("")

    let maybeRouteFivePanels = null
    if (org === "route5") {
        maybeRouteFivePanels = <span>
            <UPCManagement/>
            <PriceManagement/>
        </span>
    }
    return (
    
        <div>
            <BackButton/>
            <div id="main-interface">
                <h1 id="page-title">Management</h1>
                <UserManagement/>
                <RateManagement/>
                
            </div>
        </div>
    )
}