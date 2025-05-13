"use client"

import "@/app/style.css"
import getInventory from "@/backend/getInventory"
import ProductDisplayer from "@/components/ProductDisplayer"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { useState } from "react"

export default function InventoryManagement () {
    const [inventory, setInventory] = useState<ProductQuantityList>(new ProductQuantityList())
    const [errorText, setErrorText] = useState<string>("")
    const [totalValue, setTotalValue] = useState<number>(0)
    getInventory(
    ).then( (value) => {
        let runningValue = 0
        if ("error" in value) {
            setErrorText(value["error"])
            return
        }
        for (let item of value) {
            inventory.addProduct(item)
            runningValue += item.sale_price
        }
        setTotalValue(runningValue)
    })
    return (
        <div>
            <h1>Manage Inventory</h1>
            <p className="error-text">
                {errorText}
            </p>
            <ProductDisplayer products={inventory}/>
        </div>
    )
}