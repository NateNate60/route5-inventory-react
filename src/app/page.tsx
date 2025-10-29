"use client"

import "@/css/style.css"
import "@/css/small.css"
import "@/css/buttons.css"
import "@/app/home.css"
import getInventory from "@/backend/getInventory"
import DropdownMenu from "@/components/DropdownMenu"
import ProductDisplayer from "@/app/ProductDisplayer"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { use, useEffect, useState } from "react"

import { FILTERS, SORTS } from "@/types/Sort"
import { refreshToken } from "@/backend/login"
import LoginWidget from "@/components/LoginWidget"
import TextButton from "@/components/buttons/buttons"

export default function InventoryManagement () {
    const [inventory, setInventory] = useState<ProductQuantityList>(new ProductQuantityList())
    const [errorText, setErrorText] = useState<string>("")
    const [totalValue, setTotalValue] = useState<number>(0)
    const [acquisitionValue, setAcquisitionValue] = useState<number>(0)
    const [searchString, setSearchString] = useState<string>("")
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
            let acquiredRunningValue = 0
            if ("error" in value) {
                setErrorText(value["error"])
                return
            }
            for (let item of value) {
                inventory.addProduct(item)
                runningValue += item.sale_price * item.quantity
                acquiredRunningValue += item.acquired_price * item.quantity
            }
            setTotalValue(runningValue)
            setAcquisitionValue(acquiredRunningValue)
            setErrorText("")
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
                            <TextButton colour="orange" text="Record New Transaction" href="/unifiedbuysell"/>
                        </td>
                        <td>
                            <TextButton colour="blue" text="View Transaction History" href="/transactions"/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <TextButton colour="white" text="Management" href="/manage"/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="error-text">
                {errorText}
                <br/>
            </p>
            <div id="summary">
                <table className="fullwidth">
                    <tbody>
                        <tr>
                            <td>
                                Total value of inventory if everything is sold at asking: 
                            </td>
                            <td>
                                $ {Math.round(totalValue) / 100}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total value of inventory according to purchase price: 
                            </td>
                            <td>
                                $ {Math.round(acquisitionValue) / 100}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <hr/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Sort
                            </td>
                            <td>
                                <DropdownMenu options={SORTS} selected={sort} onClick={(s) => setSort(s)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Filter
                            </td>
                            <td>
                                <DropdownMenu options={FILTERS} selected={filter} onClick={(f) => setFilter(f)} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <hr/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Search
                            </td>
                            <td>
                                <input type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ProductDisplayer products={inventory} editable={true} filter={filter} sort={sort} search={searchString}/>
        </div>
    )
}