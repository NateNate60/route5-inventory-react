import { useEffect, useState } from "react";
import WhiteTextButton from "./buttons/whitebutton";
import { checkAccessValidity } from "@/backend/login";

export default function LoginWidget () {
    const [username, setUsername] = useState<string>("")

    useEffect( () => {
        checkAccessValidity(
        ).then( (record) => setUsername(record.username))
    }, [])

    let maybeLoginButton
    if (! username) {
        maybeLoginButton = <WhiteTextButton text="Log in" href="/login"/>
    }
    return (
        <div id="login-widget">
            <p>
                Welcome{username ? ", " + username : "\nPlease log in."}
            </p>
            {maybeLoginButton}
        </div>
    )
}