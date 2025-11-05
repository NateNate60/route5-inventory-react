"use client"

import { useEffect, useState } from "react";
import { checkAccessValidity, logout, refreshToken } from "@/backend/login";
import TextButton from "./buttons/buttons";

interface LoginWidgetProps {
    onTokenFetch: () => void
}

export default function LoginWidget ({onTokenFetch}: LoginWidgetProps) {
    const [username, setUsername] = useState<string>("")

    useEffect( () => {
        checkAccessValidity(
        ).then( (record) => {
            setUsername(record.username)
            if (record.username) {
                onTokenFetch()
            }
        }
        )
    }, [])

    let loginButton
    if (! username) {
        loginButton = <TextButton colour="white" text="Log in" href="/login"/>
    } else {
        loginButton = <TextButton colour="white" text="Log out" onClick={logout}/>
    }
    return (
        <div id="login-widget">
            <p>
                Welcome{username ? ", " + username : ". Please log in."}
            </p>
            {loginButton}
        </div>
    )
}