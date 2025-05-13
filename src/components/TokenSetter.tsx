"use client"
import React, { useState } from "react";
import WhiteTextButton from "./buttons/whitebutton";

export default function TokenSetter () {
    /*
    Component which sets the value of a login token
    */

    const [value, setValue] = useState<string>("")
    return (
        <form>
            <label>Paste access token:</label>
            <input type="password"  name="cookie-input" onChange={ (e) => setValue(e.target.value)} value={value}/>
            <WhiteTextButton text="Set" onClick={() => {
                // Cookie expires in 30 days
                document.cookie = `token=Bearer ${value}; max-age=2592000`
            }}/>
        </form>
        
    )
}