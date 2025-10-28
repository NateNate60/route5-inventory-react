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
    changeBarcode: (oldBarcode: string, newBarcode: string) => any,
    onDelete: (item: string) => any,
    cashPaid: number,
    setCashPaid: (amount: number) => any,
    creditPaid: number
    setCreditPaid: (amount: number) => any,
    bulkTotal: number,
    setBulk: (amount: number) => any,
    setPaymentMethod: (paymentMethod: string) => any
}

export default function BulkBuyPanel ({cart, changeBarcode, onDelete, cashPaid, setCashPaid, creditPaid, setCreditPaid, bulkTotal, setBulk, setPaymentMethod}: BuyPanelProps) {

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
    let cashTotal = 0
    let creditTotal = 0
    let marketTotal = 0
    let lowTotal = 0
    for (let thing in cart.products) {
        let product = cart.products[thing]
        let marketPrice = cart.products[thing].product.type === "slab" ? cart.products[thing].product.sale_price : (getMarketPrice(product.product) ?? NaN)
        let lowPrice = getLowPrice(product.product) ?? NaN

        // Calculate suggested price according to rate table
        let [cashRate, creditRate] = rates !== undefined ? calculateRates(rates, marketPrice, product.product.type) : [NaN, NaN]

        // Usually the market price, unless the card is under thre threshhold AND the TCG Low is lower than market.
        let effectivePrice = marketPrice < threshhold && lowPrice < marketPrice ? lowPrice : marketPrice

        cashTotal += Math.floor((effectivePrice * cashRate) / 50) * 50
        creditTotal += Math.floor((effectivePrice * creditRate) / 50) * 50
        marketTotal += marketPrice
        lowTotal += lowPrice

        buyTableEntries.push(<BuyPanelEntry product={cart.products[thing]} key={cart.products[thing].product.id}
                              marketPrice={marketPrice}
                              lowPrice={lowPrice}
                              cashRate={cashRate}
                              creditRate={creditRate}
                              assetTagThreshhold={threshhold}
                              onDelete={(id) => onDelete(id)}
                              setBarcode={changeBarcode}
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
        <div className="buy-panel">
            <table className="buy-panel-table fullwidth">
                <thead>
                    <tr>
                        <td colSpan={7} className="table-title">
                            Buy from Customer
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
                            Qty
                        </th>
                        <th>
                            Market
                        </th>
                        <th>
                            Lowest Listing
                        </th>
                        <th>
                            Cash Offer
                        </th>
                        <th>
                            Store Credit Offer
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

                        </td>
                        <td>
                            $&nbsp;{Math.round(marketTotal) / 100}
                        </td>
                        <td>
                            $&nbsp;{Math.round(lowTotal) / 100}
                        </td>
                        <td>
                            $&nbsp;{Math.round(cashTotal) / 100}
                        </td>
                        <td>
                            $&nbsp;{Math.round(creditTotal) / 100}
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
                        <td colSpan={2}>
                            Store Credit
                        </td>
                        <td colSpan={2}>
                            $ <NumericEntryField step={0.01} value={creditPaid / 100} onChange={(value) => {
                                setCreditPaid(value * 100)
                            }} min={0}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Money
                        </td>
                        <td colSpan={2}>
                            $ <NumericEntryField step={0.01} value={cashPaid / 100} onChange={(value) => {
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

interface BuyPanelEntryProps {
    product: ProductQuantity,
    setBarcode: (oldBarcode: string, newBarcode: string) => boolean,
    onDelete: (id: string) => void,
    updatePrice: (newPrice: number) => void,
    updateQuantity: (newQty: number) => void,
    marketPrice: number,
    lowPrice: number,
    cashRate: number,
    creditRate: number,
    assetTagThreshhold: number
}

function BuyPanelEntry ({product, setBarcode, onDelete, updatePrice, updateQuantity, marketPrice, lowPrice, cashRate, creditRate, assetTagThreshhold}: BuyPanelEntryProps) {
    
    const [barcodeField, setBarcodeField] = useState<string>(product.product.id[0] === "A" ? product.product.id : "")
    const [barcodeFieldDisabled, setBarcodeFieldDisabled] = useState<boolean>(product.product.id[0] === "A")
    const [errorText, setError] = useState<string>("")

    // Usually the market price, unless the card is under thre threshhold AND the TCG Low is lower than market.
    let effectivePrice = marketPrice < assetTagThreshhold && lowPrice < marketPrice ? lowPrice : marketPrice

    let maybeBarcode = undefined
    if (product.product.type !== "card") {
        maybeBarcode = product.product.id
    } else if (marketPrice >= (assetTagThreshhold ?? Infinity)) {
        maybeBarcode = <form onSubmit={(e) => {
            e.preventDefault()
            
            if (setBarcode(product.product.id, barcodeField)) {
                setBarcodeFieldDisabled(true)
                setError("")
            } else {
                setError("This bar code is a duplicate.")
            }
            
        }}>
            <input size={6} onChange={(e) => setBarcodeField(e.target.value)} value={barcodeField} disabled={barcodeFieldDisabled}/>
            <p className="error-text">
                {errorText}
            </p>
        </form>
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
                {product.product.type === "sealed" ? <NumericEntryField step={1} onChange={(value) => {
                    if (value === 0) {
                        onDelete(product.product.id)
                    } else {
                        updateQuantity(value)
                    }
                }} value={product.quantity}/> : null}
            </td>
            <td>
                $&nbsp;{product.product.type === "slab" ? <NumericEntryField step={0.01} onChange={updatePrice} value={marketPrice / 100}/> : Math.round(marketPrice) / 100}
                {product.product.type === "sealed" ? " ea." : null}
            </td>
            <td>
                $&nbsp;{product.product.type !== "card" ? Math.round(marketPrice) / 100 : Math.round(lowPrice) / 100}
                {product.product.type === "sealed" ? " ea." : null}
            </td>
            <td>
                $&nbsp;{Math.floor((effectivePrice * cashRate) / 50) / 2} ({Math.round(cashRate * 100)}%)
            </td>
            <td>
                $&nbsp;{Math.floor((effectivePrice * creditRate) / 50) / 2} ({Math.round(creditRate * 100)}%)
            </td>
            <td>
                <DeleteButton onClick={() => {onDelete(product.product.id)}}/>
            </td>
        </tr>
    )
}

