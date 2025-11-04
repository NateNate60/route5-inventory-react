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
import { getMarketPrice } from "@/backend/searchProducts"
import updatePrice from "@/backend/updatePrice"
import { getThreshhold } from "@/backend/settings"

function matchMarketPrices (inventory: ProductQuantityList, type: "card" | "slab" | "sealed", threshold: number): ProductQuantityList {
    /*
        Match all cards in inventory of type type to the market price.
        Rounds up to the nearest dollar for cards under the threshold.
        Rounds down to the nearest dollar for cards above the threshold.
        Ignores items with undefined market price.
        Calls the API to update the price for all modified items.
    */
    let newInventory = new ProductQuantityList()
    newInventory.products = inventory.products
    for (let item in newInventory.products) {
        if (newInventory.products[item].product.type === type
        ) {
            let marketPrice = getMarketPrice(newInventory.products[item].product)
            if (marketPrice) {
                if (marketPrice < threshold) {
                    marketPrice = Math.ceil(marketPrice / 100) * 100
                } else {
                    marketPrice = Math.floor(marketPrice / 100) * 100
                }
                marketPrice = Math.ceil(marketPrice / 50) * 50
                newInventory.products[item].product.sale_price = marketPrice
                newInventory.products[item].product.sale_price_date = new Date().toISOString()
                updatePrice(marketPrice, item)
            }
        }
    }
    return newInventory
}

export default function InventoryManagement () {
    const [inventory, setInventory] = useState<ProductQuantityList>(new ProductQuantityList())
    const [errorText, setErrorText] = useState<string>("Loading...")
    const [totalValue, setTotalValue] = useState<number>(0)
    const [acquisitionValue, setAcquisitionValue] = useState<number>(0)
    const [searchString, setSearchString] = useState<string>("")
    const [sort, setSort] = useState<string>("abc")
    const [filter, setFilter] = useState<string>("")
    const [threshold, setThreshhold] = useState<number>(NaN)

    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    useEffect( () => {
        refreshToken()
        getThreshhold().then((value) => setThreshhold(value))
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    }, [])

    useEffect( () => {
        getInventory(
        ).then( (value) => {
            let inventory = new ProductQuantityList()
            let runningValue = 0
            let acquiredRunningValue = 0
            if ("error" in value) {
                if (value.error === "Missing Authorization Header") {
                    setErrorText("You're not logged in")
                    setLoggedIn(false)
                    return
                }
                setErrorText(value["error"])
                setLoggedIn(false)
                return
            }
            setLoggedIn(true)
            for (let item of value) {
                inventory.addProduct(item)
                runningValue += item.sale_price * item.quantity
                acquiredRunningValue += item.acquired_price * item.quantity
            }
            setTotalValue(runningValue)
            setAcquisitionValue(acquiredRunningValue)
            setErrorText("")
            setInventory(inventory)
        })
    }, [])

    return (
        <div>
            <LoginWidget onTokenFetch={() =>{}}/>
            <h1 id="page-title">Manage Inventory</h1>
            <table id="navigation">
                <tbody>
                    <tr>
                        <td>
                            <TextButton colour="orange" text="Record New Transaction" href="/unifiedbuysell" disabled={!loggedIn}/>
                        </td>
                        <td>
                            <TextButton colour="blue" text="View Transaction History" href="/transactions" disabled={!loggedIn}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <TextButton colour="white" text="Management" href="/manage" disabled={!loggedIn}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="error-text" id="mainpage-error-text">
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
                        <tr>
                            <th colSpan={2}>
                                Update prices to match market
                            </th>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <TextButton colour="white" text="Update all singles prices" disabled={!loggedIn} onClick={() => setInventory(matchMarketPrices(inventory, "card", threshold))}/>
                                <TextButton colour="white" text="Update all sealed prices" disabled={!loggedIn} onClick={() => setInventory(matchMarketPrices(inventory, "sealed", threshold))}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ProductDisplayer products={inventory} filter={filter} sort={sort} search={searchString}/>
        </div>
    )
}