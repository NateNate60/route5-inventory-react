"use client"
import React from "react";

import constants from "./constants.json"

export default function TokenSetter () {
    /*
    Component which sets the value of a login token
    */

    return (
        <form>
            <label>Paste token:</label>
            <input type="password" onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                document.cookie = `token=Bearer ${e.target.value}`
            }}/>
        </form>
        
    )
}