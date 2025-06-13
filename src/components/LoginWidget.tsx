import { useEffect, useState } from "react";
import WhiteTextButton from "./buttons/whitebutton";
import { checkAccessValidity, refreshToken } from "@/backend/login";

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

    let maybeLoginButton
    if (! username) {
        maybeLoginButton = <WhiteTextButton text="Log in" href="/login"/>
    }
    return (
        <div id="login-widget">
            <p>
                Welcome{username ? ", " + username : ". Please log in."}
            </p>
            {maybeLoginButton}
        </div>
    )
}