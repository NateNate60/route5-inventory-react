"use client"
import React, { useState } from "react"
import {Product, SlabCert, TCGProductData} from "../../types/Product"
import SearchBar from "./SearchBar"
import getProductInfo from "@/backend/getProductInfo"
import { BackendAPIError } from "@/types/BackendAPIError"
import searchProducts from "@/backend/searchProducts"
import TextButton, { WhiteTextButton } from "@/components/buttons/buttons"
import getInventory from "@/backend/getInventory"

interface InventorySearcherProps {
    onSubmit: (e: Product | BackendAPIError | SlabCert, barcode: string) => any,
    showSuggestions?: boolean
}

export function BuyInventorySearcher ({onSubmit, showSuggestions}: InventorySearcherProps): React.JSX.Element {
    /*
    A component which provides a search bar for searching the inventory.
    */

    const [tcgSuggestions, setTCGSuggestions] = useState<Array<TCGProductData>>([])
    const [inventorySuggestions, setInventorySuggestions] = useState<Array<Product>>([])

    const [tcgResultsText, setTCGResultsText] = useState<string>("Press enter to search TCG Player database...")
    const [inventoryResultsText, setInventoryResultsText] = useState<string>("Start typing to search inventory...")
    const today = new Date().toISOString()

    function clearAll () {
        setInventoryResultsText("Start typing to search inventory...")
        setInventorySuggestions([])
        setTCGResultsText("Press enter to search TCG Player database...")
        setTCGSuggestions([])
    }

    return (
        <div>
            <table className="fullwidth">
                <thead>
                    <tr>
                        <td colSpan={5}>
                            <SearchBar onChange={(input: string) => {
                                if (input.match(/^\d+$/)) {
                                    return
                                }
                                if (input.length < 3) {
                                    clearAll()
                                    return
                                }
                                getInventory()
                                .then( (value) => {
                                    if ("error" in value) {
                                        setInventoryResultsText("Error")
                                        setTCGSuggestions([])
                                        return
                                    }
                                    setInventoryResultsText("")
                                    let results: Array<Product> = value
                                    .filter( (value) => value !== undefined)
                                    results = results.filter(
                                        (value) => `${value.tcg_price_data?.setName} ${value.tcg_price_data?.canonicalName} ${value.tcg_price_data?.number}`.toLowerCase().includes(input.toLowerCase())
                                    )
                                    if (results.length === 0) {
                                        setInventoryResultsText("No results.\n\nPress enter to try searching the TCG Player database instead")
                                    }
                                    setInventorySuggestions(results)
                                })
                                setInventoryResultsText("Searching...")
                            }} onSubmit={(input: string) => {
                                let s = input
                                if (input.toLowerCase().includes("psacard.com")) {
                                    let split = input.split("/")
                                    s = split[split.length - 2]
                                }
                                if (s.match(/^((\d{12})|(^[^1]\d{12}))$/) // UPC
                                    || s.match(/^A\d\d\d\d$/) // Asset tag
                                    || s.match(/^\d{8,10}$/) // PSA/BGS/CGC slabs
                                    || s.match(/^1\d{12}$/) // New PSA slabs
                                    || s.match(/^\d{14}$/) // CGC slabs
                                ) {
                                    getProductInfo(s
                                    ).then( (item) => {
                                        setInventoryResultsText("Start typing to search inventory...")
                                        setInventorySuggestions([])
                                        setTCGResultsText("Press enter to search TCG Player database...")
                                        setTCGSuggestions([])
                                        onSubmit(item, s)
                                    })
                                } else if (showSuggestions) {
                                    searchProducts(s, "card"
                                    ).then( (value) => {
                                        if (value.length === 0) {
                                            setTCGResultsText("No results")
                                        } else {
                                            setTCGResultsText("")
                                        }
                                        setTCGSuggestions(value)
                                    })
                                    setTCGResultsText("Searching...")
                                }
                            }}/>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colSpan={5}>Inventory</th>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <i>{inventoryResultsText}</i>
                        </td>
                    </tr>
                    {inventorySuggestions.map((suggestion) => <tr>
                        <td>
                            {suggestion.tcg_price_data?.setName}
                        </td>
                        <td>
                            {suggestion.tcg_price_data?.canonicalName ?? suggestion.description} {suggestion.condition}
                        </td>
                        <td>
                            {suggestion.tcg_price_data?.number}
                        </td>
                        <td>
                            {suggestion.tcg_price_data?.attribute}
                        </td>
                        <td>
                            <WhiteTextButton text="Add" onClick={() => {
                                onSubmit(suggestion, suggestion.id)
                                clearAll()
                            }}/>
                        </td>
                        </tr>
                    )}
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <th colSpan={5}>TCG Player Card Catalogue</th>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <i>{tcgResultsText}</i>
                        </td>
                    </tr>
                    {tcgSuggestions.map(
                        (suggestion) => {
                        return <tr key={suggestion.tcgID}>
                            <td>
                                {suggestion.setName}
                            </td>
                            <td>
                                {suggestion.canonicalName}
                            </td>
                            <td>
                                {suggestion.number}
                            </td>
                            <td>
                                {suggestion.attribute}
                            </td>
                            <td>
                                <TextButton colour="white" text="NM" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: NaN,
                                        acquired_date: today,
                                        sale_price: 1,
                                        tcg_price_data: suggestion,
                                        quantity: 1,
                                        consignor_name: "",
                                        consignor_contact: "",
                                        sale_date: "",
                                        sale_price_date: today,
                                        condition: "NM",
                                    }, "")
                                    clearAll()
                                }}/>
                                <TextButton colour="white" text="LP" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: NaN,
                                        acquired_date: today,
                                        sale_price: 1,
                                        tcg_price_data: suggestion,
                                        quantity: 1,
                                        consignor_name: "",
                                        consignor_contact: "",
                                        sale_date: "",
                                        sale_price_date: today,
                                        condition: "LP",
                                    }, "")
                                    clearAll()
                                }}/>
                                <TextButton colour="white" text="MP" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: NaN,
                                        acquired_date: today,
                                        sale_price: 1,
                                        tcg_price_data: suggestion,
                                        quantity: 1,
                                        consignor_name: "",
                                        consignor_contact: "",
                                        sale_date: "",
                                        sale_price_date: today,
                                        condition: "MP",
                                    }, "")
                                    clearAll()
                                }}/>
                                <TextButton colour="white" text="HP" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: NaN,
                                        acquired_date: today,
                                        sale_price: 1,
                                        tcg_price_data: suggestion,
                                        quantity: 1,
                                        consignor_name: "",
                                        consignor_contact: "",
                                        sale_date: "",
                                        sale_price_date: today,
                                        condition: "HP",
                                    }, "")
                                    clearAll()
                                }}/>
                                <TextButton colour="white" text="DM" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: NaN,
                                        acquired_date: today,
                                        sale_price: 1,
                                        tcg_price_data: suggestion,
                                        quantity: 1,
                                        consignor_name: "",
                                        consignor_contact: "",
                                        sale_date: "",
                                        sale_price_date: today,
                                        condition: "DM",
                                    }, "")
                                    clearAll()
                                }}/>
                            </td>
                        </tr>}
                    )}
                </tbody>
            </table>
        </div>
    )
}

// This function removed; both Sell and Buy functions use the BuyInventorySearcher
export var SellInventorySearcher: ({onSubmit, showSuggestions}: InventorySearcherProps) => React.JSX.Element = BuyInventorySearcher

// export function SellInventorySearcher ({onSubmit}: InventorySearcherProps): React.JSX.Element {
//     /*
//     A component which provides a search bar for searching the inventory.
//     */
//     return (
//         <div>
//             <SearchBar big={true} onSubmit={(input: string) => {
//                 let s = input
//                 if (input.toLowerCase().includes("psacard.com")) {
//                     let split = input.split("/")
//                     s = split[split.length - 2]
//                 }
//                 getProductInfo(s
//                 ).then( (item) => {
//                     onSubmit(item, s)
//                 })
//             }}/>
//         </div>
//     )
// }