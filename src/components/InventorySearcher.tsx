"use client"
import React from "react"
import {Product, SlabCert} from "../types/Product"
import SearchBar from "./SearchBar"
import getProductInfo from "@/backend/getProductInfo"
import { BackendAPIError } from "@/types/BackendAPIError"

interface InventorySearcherProps {
    onSubmit: (e: Product | BackendAPIError | SlabCert) => any
}

export default function InventorySearcher ({onSubmit}: InventorySearcherProps): React.JSX.Element {
    /*
    A component which provides a search bar for searching the inventory.
    */
    return (
        <div>
            <SearchBar big={true} onSubmit={(s: string) => {
                getProductInfo(s
                ).then( (item) => {onSubmit(item)})
            }}/>
        </div>
    )
}