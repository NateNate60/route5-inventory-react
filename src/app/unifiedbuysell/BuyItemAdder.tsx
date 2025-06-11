"use client"

import InventorySearcher from "@/components/InventorySearcher"
import ProductInfoForm from "@/components/ProductInfoForm"
import { Product } from "@/types/Product"
import { useState } from "react"

interface BuyItemAdderProps {
    onSubmit: (product: Product) => any
}

export default function BuyItemAdder ({onSubmit}: BuyItemAdderProps) {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [barcode, setBarcode] = useState<string>("")
    const [pricePaid, setPricePaid] = useState<number>(0)
    const [errorText, setErrorText] = useState<string>("")

    let maybeText
    let maybeForm = showForm ? <ProductInfoForm onSubmit={(product) => {
            setShowForm(false)
            setBarcode("")
            onSubmit(product)
        }} barcode={barcode}/> : undefined
    return (
        <div className="buy-panel">
            <h3>Add item received from customer</h3>
            <br />
            <InventorySearcher onSubmit={(result, barcode) => {
                if ("error" in result) {
                    // Not found in inventory
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
            }} />
            {maybeText}
            {maybeForm}
        </div>
    )
}