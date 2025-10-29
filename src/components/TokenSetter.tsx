"use client"
import React, { useState } from "react";
import TextButton from "./buttons/buttons";

export default function TokenSetter () {
    /*
    Component which sets the value of a login token
    */

    const [value, setValue] = useState<string>("")
    return (
        <form>
            <label>Paste access token:</label>
            <input type="password"  name="cookie-input" onChange={ (e) => setValue(e.target.value)} value={value}/>
            <TextButton colour="white" text="Set" onClick={() => {
                // Cookie expires in 30 days
                document.cookie = `token=Bearer ${value}; max-age=2592000`
            }}/>
        </form>
        
    )
}