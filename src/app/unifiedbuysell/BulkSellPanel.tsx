"use client"

import { ProductQuantity } from "@/types/Product"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { JSX, useEffect, useState } from "react"
import { PaymentMethodEntry } from "./PaymentMethodEntry"
import NumericEntryField from "@/components/NumericEntryField"
import DeleteButton from "@/components/buttons/DeleteButton"
import { getLowPrice, getMarketPrice } from "@/backend/searchProducts"
import { Rates } from "@/types/Rates"
import { getRates, getThreshhold } from "@/backend/settings"
import calculateRates from "@/backend/calculateRates"

interface BuyPanelProps {
    cart: ProductQuantityList,
    onDelete: (item: string) => any,
    cashPaid: number,
    setCashPaid: (amount: number) => any,
    creditPaid: number
    setCreditPaid: (amount: number) => any,
    bulkTotal: number,
    setBulk: (amount: number) => any,
    setPaymentMethod: (paymentMethod: string) => any
}

export default function BulkSellPanel ({cart, onDelete, cashPaid, setCashPaid, creditPaid, setCreditPaid, bulkTotal, setBulk, setPaymentMethod}: BuyPanelProps) {

    const [rates, setRates] = useState<Rates>()
    const [threshhold, setThreshhold] = useState<number>(Infinity)
    const [counter, setCounter] = useState<number>(0)

    useEffect( () => {
        getRates(
        ).then( (r) => setRates(r))

        getThreshhold(
        ).then( (r) => setThreshhold(r))
    }, [])

    let buyTableEntries: Array<JSX.Element> = []
    let acquiredTotal = 0
    let askingTotal = 0
    let marketTotal = 0
    for (let thing in cart.products) {
        let product = cart.products[thing]
        let marketPrice = cart.products[thing].product.type === "slab" ? cart.products[thing].product.sale_price : (getMarketPrice(product.product) ?? NaN)

        acquiredTotal += isNaN(cart.products[thing].product.acquired_price) ? 0 : cart.products[thing].product.acquired_price * cart.products[thing].quantity
        askingTotal += cart.products[thing].product.sale_price * cart.products[thing].quantity
        marketTotal += marketPrice

        buyTableEntries.push(<SellPanelEntry product={cart.products[thing]} key={cart.products[thing].product.id}
                              marketPrice={marketPrice}
                              assetTagThreshhold={threshhold}
                              onDelete={(id) => onDelete(id)}
                              updatePrice={(newPrice) => {
                                cart.products[thing].product.sale_price = newPrice * 100
                                setCounter(counter + 1)
                              }}
                              updateQuantity={(newQty) => {
                                cart.products[thing].quantity = newQty
                                setCounter(counter + 1)
                              }}
                              />)
    }

    return (
        <div className="sell-panel">
            <table className="sell-panel-table fullwidth">
                <thead>
                    <tr>
                        <td colSpan={7} className="table-title">
                            Sell to Customer
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Bar code
                        </th>
                        <th>
                            Item
                        </th>
                        <th>
                            Market
                        </th>
                        <th>
                            Acquired Price
                        </th>
                        <th>
                            Asking Price
                        </th>
                        <th>
                            Qty
                        </th>
                        <th>
                            Price Total
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {buyTableEntries}
                    <tr>
                        <td>
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7}>
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Totals
                        </td>
                        <td>
                            $&nbsp;{Math.round(marketTotal) / 100}
                        </td>
                        <td>
                            $&nbsp;{isNaN(acquiredTotal) ? "" : Math.round(acquiredTotal) / 100}
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                            <b>$&nbsp;{Math.round(askingTotal) / 100}</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4}>
                            Store Credit Received
                        </td>
                        <td colSpan={1}>
                            $&nbsp;<NumericEntryField step={0.01} value={creditPaid / 100} onChange={(value) => {
                                setCreditPaid(value * 100)
                            }} min={0}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4}>
                            Money Received
                        </td>
                        <td colSpan={1}>
                            $&nbsp;<NumericEntryField step={0.01} value={cashPaid / 100} onChange={(value) => {
                                setCashPaid(value * 100)
                            }} min={0}/>
                        </td>
                        <td>
                            <PaymentMethodEntry onChange={setPaymentMethod}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

interface SellPanelEntryProps {
    product: ProductQuantity,
    onDelete: (id: string) => void,
    updatePrice: (newPrice: number) => void,
    updateQuantity: (newQty: number) => void,
    marketPrice: number,
    assetTagThreshhold: number
}

function SellPanelEntry ({product, onDelete, updatePrice, updateQuantity, marketPrice, assetTagThreshhold}: SellPanelEntryProps) {
    
    const [errorText, setError] = useState<string>("")

    let maybeBarcode = undefined
    if (product.product.type !== "card") {
        maybeBarcode = product.product.id
    } else if (marketPrice >= (assetTagThreshhold ?? Infinity) && ! isNaN(product.product.acquired_price)) {
        maybeBarcode = product.product.id
    } else {
        maybeBarcode = "Untracked"
    }

    return (
        <tr>
            <td>
                {maybeBarcode}
            </td>
            <td>
                {product.product.description} {product.product.tcg_price_data?.number} {product.product.condition}
            </td>
            
            <td>
                $&nbsp;{Math.round(marketPrice) / 100}
                {product.product.type === "sealed" ? " ea." : null}
            </td>
            <td>
                {isNaN(product.product.acquired_price) ? "" : "$ " + Math.round(product.product.acquired_price) / 100}
                {product.product.type === "sealed" ? " ea." : null}
            </td>
            <td>
                $&nbsp;{Math.round(product.product.sale_price) / 100}
            </td>
            <td>
                {product.product.type === "sealed" ? <NumericEntryField step={1} onChange={(value) => {
                    if (value === 0) {
                        onDelete(product.product.id)
                    } else if (value > product.product.quantity) {
                        setError(`Only ${product.product.quantity} in stock`)
                        updateQuantity(product.product.quantity)
                    } else {
                        setError("")
                        updateQuantity(value)
                    }
                }} value={product.quantity}/> : null}
                <p className="error-text">
                    {errorText}
                </p>
            </td>
            <td>
                $&nbsp;{Math.round(product.product.sale_price * product.quantity) / 100}
            </td>
            <td>
                <DeleteButton onClick={() => {onDelete(product.product.id)}}/>
            </td>
        </tr>
    )
}

