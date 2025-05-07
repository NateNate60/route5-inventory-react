"use client"
import React from "react"
import {Product} from "../types/Product"
import constants from "./constants.json"

interface InventorySearcherProps {
    onSubmit: (e: Product) => any
}

function getCookieValue (name: string): string {
    /*
    A function that gives a cookie with a given name

    Found on Stack Overflow
    https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
    */
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
}

export default function InventorySearcher ({onSubmit}: InventorySearcherProps): React.JSX.Element {
    /*
    A component which provides a search bar for searching the inventory.
    */
    return (
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            let urlParams = new URLSearchParams(
                {
                    "id": e.currentTarget.elements.barcode.value
                }
            )

            // Fetch data from back-end server
            fetch(`${constants.BACKEND_URL}/v1/inventory?${urlParams}`,
                {
                    headers: new Headers({
                        "Authorization": getCookieValue("token")
                    })
                }
            ).then( (response) => response.json()
            ).then( (json: Product) => {onSubmit(json)} )
            
        }}>
            <label>Scan or input bar code:</label>
            <input type="text" id="barcode" className="big-input"/>
        </form>
    )
}