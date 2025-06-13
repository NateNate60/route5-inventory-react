"use client"

import { useEffect, useState } from "react";
import WhiteTextButton from "./buttons/whitebutton";
import { checkAccessValidity, logout, refreshToken } from "@/backend/login";

interface LoginWidgetProps {
    onTokenFetch?: () => void
}

export default function LoginWidget ({onTokenFetch}: LoginWidgetProps) {
    const [username, setUsername] = useState<string>("")

    useEffect( () => {
        checkAccessValidity(
        ).then( (record) => {
            setUsername(record.username)
            onTokenFetch?.()
        }
        )
    }, [])

    let loginButton
    if (! username) {
        loginButton = <WhiteTextButton text="Log in" href="/login"/>
    } else {
        loginButton = <WhiteTextButton text="Log out" onClick={logout}/>
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