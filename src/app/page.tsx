"use client"

import "@/css/style.css"
import "@/css/small.css"
import "@/css/buttons.css"
import getInventory from "@/backend/getInventory"
import DropdownMenu from "@/components/DropdownMenu"
import ProductDisplayer from "@/app/ProductDisplayer"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { use, useEffect, useState } from "react"

import { FILTERS, SORTS } from "@/types/Sort"
import OrangeTextButton from "@/components/buttons/orangebutton"
import BlueTextButton from "@/components/buttons/bluebuttton"
import { refreshToken } from "@/backend/login"
import LoginWidget from "@/components/LoginWidget"
import WhiteTextButton from "@/components/buttons/whitebutton"

export default function InventoryManagement () {
    const [inventory, setInventory] = useState<ProductQuantityList>(new ProductQuantityList())
    const [errorText, setErrorText] = useState<string>("")
    const [totalValue, setTotalValue] = useState<number>(0)
    const [sort, setSort] = useState<string>("abc")
    const [filter, setFilter] = useState<string>("")

    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    }, [])

    useEffect( () => {
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
    }, [loggedIn])

    return (
        <div>
            <LoginWidget onTokenFetch={() => setLoggedIn(true)}/>
            <h1 id="page-title">Manage Inventory</h1>
            <table id="navigation">
                <tbody>
                    <tr>
                        <td>
                            <OrangeTextButton text="Record New Transaction" href="/unifiedbuysell"/>
                        </td>
                        <td>
                            <BlueTextButton text="View Transaction History" href="/transactions"/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <WhiteTextButton text="Management" href="/manage"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="error-text">
                {errorText}
                <br/>
            </p>
            <div id="summary">
                <p>
                    Total value of inventory if everything is sold at asking: ${totalValue / 100}
                </p>
                <p>
                    Sort by: <DropdownMenu options={SORTS} selected={sort} onClick={(s) => setSort(s)} />
                </p>
                <p>
                    Filter by: <DropdownMenu options={FILTERS} selected={filter} onClick={(f) => setFilter(f)} />
                </p>
            </div>
            <ProductDisplayer products={inventory} editable={true} filter={filter} sort={sort}/>
        </div>
    )
}