"use client"

import "@/app/style.css"
import "@/app/buttons.css"
import getInventory from "@/backend/getInventory"
import BackButton from "@/components/buttons/backbutton"
import DropdownMenu from "@/components/DropdownMenu"
import ProductDisplayer from "@/components/ProductDisplayer"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { useState } from "react"

import constants from "@/constants.json"
import { FILTERS, SORTS } from "@/types/Sort"

export default function InventoryManagement () {
    const [inventory, setInventory] = useState<ProductQuantityList>(new ProductQuantityList())
    const [errorText, setErrorText] = useState<string>("")
    const [totalValue, setTotalValue] = useState<number>(0)
    const [sort, setSort] = useState<string>("abc")
    const [filter, setFilter] = useState<string>("")

    getInventory(
    ).then( (value) => {
        let runningValue = 0
        if ("error" in value) {
            setErrorText(value["error"])
            return
        }
        for (let item of value) {
            inventory.addProduct(item)
            runningValue += item.sale_price * item.quantity
        }
        setTotalValue(runningValue)
    })
    return (
        <div>
            <h1>Manage Inventory</h1>
            <BackButton/>
            <p className="error-text">
                {errorText}
                <br/>
            </p>
            <p>
                <br/>
                Total value of inventory if everything is sold at asking: ${totalValue / 100}
            </p>
            <p>
                Sort by: <DropdownMenu options={SORTS} selected={sort} onClick={(s) => setSort(s)} />
            </p>
            <p>
                Filter by: <DropdownMenu options={FILTERS} selected={filter} onClick={(f) => setFilter(f)} />
            </p>
            <ProductDisplayer products={inventory} editable={true} filter={filter} sort={sort}/>
        </div>
    )
}