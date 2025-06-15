"use client"

import WhiteTextButton from "@/components/buttons/whitebutton"
import "@/css/style.css"
import "./login.css"
import { useEffect, useState } from "react"
import { login, refreshToken } from "@/backend/login"

export default function LoginPage () {
    const [staySignedIn, setStaySignedIn] = useState<boolean>(false)
    const [errorText, setErrorText] = useState<string>("")

    return (
        <div>
            <form onSubmit={async (event) => {
                event.preventDefault()
                let formData = new FormData(event.currentTarget)
                let success = await login(formData.get("username")?.toString() ?? "",
                    formData.get("password")?.toString() ?? "",
                    staySignedIn)
                if (!success) {
                    setErrorText("Invalid username or password")
                } else {
                    window.location.href = "/"
                }
            }}>
            <table id="login-prompt">
                <tbody>
                    <tr>
                        <th>
                            Username
                        </th>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" name="username" className="login-input" 
                                onChange={() => setErrorText("")}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Password
                        </th>

                    </tr>
                    <tr>
                        <td>
                            <input type="password" name="password" className="login-input"
                                onChange={() => setErrorText("")}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="checkbox" onChange={() => setStaySignedIn(! staySignedIn)} checked={staySignedIn}/>
                            &nbsp;Keep me signed in
                        </td>
                    </tr>
                    <tr>
                        <td className="error-text">{errorText}<br/></td>
                    </tr>
                    <tr>
                        <td id="login-button">
                            <WhiteTextButton text="Log in" submit={true}/>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
            </form>
        </div>
    )
}