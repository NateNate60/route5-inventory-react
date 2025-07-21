"use client"
import React, { useState } from "react"
import {Product, SlabCert, TCGProductData} from "../../types/Product"
import SearchBar from "./SearchBar"
import getProductInfo from "@/backend/getProductInfo"
import { BackendAPIError } from "@/types/BackendAPIError"
import searchProducts from "@/backend/searchProducts"
import WhiteTextButton from "@/components/buttons/whitebutton"

interface InventorySearcherProps {
    onSubmit: (e: Product | BackendAPIError | SlabCert, barcode: string) => any,
    showSuggestions?: boolean
}

export function BuyInventorySearcher ({onSubmit, showSuggestions}: InventorySearcherProps): React.JSX.Element {
    /*
    A component which provides a search bar for searching the inventory.
    */

    const [suggestions, setSuggestions] = useState<Array<TCGProductData>>([])

    const today = new Date().toISOString()

    return (
        <div>
            <table className="fullwidth">
                <thead>
                    <tr>
                        <td>
                            <SearchBar big={true} onSubmit={(s: string) => {
                                if (s.match(/^\d{12}$/) // UPC
                                    || s.match(/^A\d\d\d\d$/) // Asset tag
                                    || s.match(/^\d{8,10}$/) // PSA/BGS/CGC slabs
                                    || s.match(/^\d{13}$/) // EAN-13
                                    || s.match(/^\d{14}$/) // CGC slabs
                                ) {
                                    getProductInfo(s
                                    ).then( (item) => {
                                        onSubmit(item, s)
                                    })
                                } else if (showSuggestions) {
                                    searchProducts(s, "card"
                                    ).then( (value) => setSuggestions(value))
                                }
                            }}/>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {suggestions.map(
                        (suggestion) => <tr key={suggestion.tcgID}>
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
                                <WhiteTextButton text="NM" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: 1,
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
                                    setSuggestions([])
                                }}/>
                                <WhiteTextButton text="LP" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: 1,
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
                                    setSuggestions([])
                                }}/>
                                <WhiteTextButton text="MP" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: 1,
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
                                    setSuggestions([])
                                }}/>
                                <WhiteTextButton text="HP" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: 1,
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
                                    setSuggestions([])
                                }}/>
                                <WhiteTextButton text="DM" onClick={ () => {
                                    onSubmit( {
                                        id: "BULK",
                                        type: "card",
                                        description: suggestion.canonicalName,
                                        acquired_price: 1,
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
                                    setSuggestions([])
                                }}/>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export function SellInventorySearcher ({onSubmit}: InventorySearcherProps): React.JSX.Element {
    /*
    A component which provides a search bar for searching the inventory.
    */
    return (
        <div>
            <SearchBar big={true} onSubmit={(s: string) => {
                getProductInfo(s
                ).then( (item) => {
                    onSubmit(item, s)
                })
            }}/>
        </div>
    )
}