"use client"
import React from "react"
import {Product} from "../types/Product"
import SearchBar from "./SearchBar"
import getProductInfo from "@/backend/getProductInfo"

interface InventorySearcherProps {
    onSubmit: (e: Product) => any
}

export default function InventorySearcher ({onSubmit}: InventorySearcherProps): React.JSX.Element {
    /*
    A component which provides a search bar for searching the inventory.
    */
    return (
        <div>
            <SearchBar big={true} onSubmit={(s: string) => {
                getProductInfo(s
                ).then( (item: Product) => {onSubmit(item)})
            }}/>
        </div>
    )
}