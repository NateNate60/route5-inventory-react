"use client"

import searchProducts, { getMarketPrice } from "@/backend/searchProducts"
import { BuyInventorySearcher } from "@/app/unifiedbuysell/InventorySearcher"
import ProductInfoForm from "@/components/ProductInfoForm"
import { Product } from "@/types/Product"
import { useState } from "react"

interface BuyItemAdderProps {
    onSubmit: (product: Product) => any,
    bulkBuyer: boolean,
    mode: "buy" | "sell"
}

export default function BuyItemAdder ({onSubmit, bulkBuyer, mode}: BuyItemAdderProps) {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [barcode, setBarcode] = useState<string>("")

    let maybeText
    let maybeForm = showForm ? <ProductInfoForm onSubmit={(product) => {
            setShowForm(false)
            setBarcode("")
            onSubmit(product)
        }} barcode={barcode}/> : undefined
    return (
        <div className={mode === "buy" ? "buy-panel" : "sell-panel"}>
            <h3>Add item</h3>
            <br />
            <BuyInventorySearcher onSubmit={(result, barcode) => {
                if ("error" in result) {
                    // Not found in inventory

                    if (barcode.match(/^((\d{12})|(^[^1]\d{12}))$/)) {
                        // This is a UPC. Try looking up in product database
                        searchProducts(barcode, "sealed"
                        ).then( (data) => {
                            if (data.length === 0 ) {
                                return
                            }
                            let result = data[0]
                            let today = new Date()
                            let product: Product = {
                                id: barcode,
                                type: "sealed",
                                description: result.canonicalName,
                                condition: "sealed",
                                acquired_price: "sealedMarketPrice" in result.priceData ? result.priceData.sealedMarketPrice : 1,
                                acquired_date: today.toString(),
                                sale_price: NaN,
                                quantity: 1,
                                consignor_name: "",
                                consignor_contact: "",
                                sale_price_date: today.toString(),
                                sale_date: "",
                                tcg_price_data: result
                            }
                            product.sale_price = getMarketPrice(product) ?? NaN
                            onSubmit(product)
                        })
                    }
                    setShowForm(true)
                    setBarcode(barcode)
                } else if ("id" in result) {
                    // Product found
                    setBarcode("")
                    setShowForm(false)
                    onSubmit(result)
                } else if ("cert" in result) {
                    let today = new Date()
                    onSubmit({
                        "acquired_date": today.toISOString(),
                        "acquired_price": 0,
                        "condition": `${result.grader} ${result.grade}`,
                        "consignor_contact": "",
                        "consignor_name": "",
                        "description": result.name,
                        "id": result.cert,
                        "quantity": 1,
                        "sale_date": "",
                        "sale_price": 0,
                        "sale_price_date": today.toISOString(),
                        "type": "slab"
                    })
                    setBarcode("")
                    setShowForm(false)
                }
            }} showSuggestions={bulkBuyer} />
            {maybeText}
            {maybeForm}
        </div>
    )
}