import WhiteTextButton from "@/components/buttons/whitebutton"
import "@/app/style.css"
import "@/app/buttons.css"
import "./login.css"
import { useEffect, useState } from "react"
import { login, refreshToken } from "@/backend/login"

export default function LoginPage () {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [staySignedIn, setStaySignedIn] = useState<boolean>(false)

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    })

    return (
        <div>
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
                                value={username} onChange={(e) => setUsername(e.target.value)}
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
                                 value={password} onChange={(e) => setPassword(e.target.value)}
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
                        <td><br/></td>
                    </tr>
                    <tr>
                        <td id="login-button">
                            <WhiteTextButton text="Log in" onClick={() => {
                                login(username, password, staySignedIn)
                            }}/>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    )
}