"use client"

import { ProductQuantityList } from "@/types/ProductQuantityList"
import { JSX, useState } from "react"
import { PaymentMethodEntry } from "./PaymentMethodEntry"
import { ProductQuantity } from "@/types/Product"
import NumericEntryField from "@/components/NumericEntryField"
import DeleteButton from "@/components/buttons/DeleteButton"
import { getMarketPrice } from "@/backend/searchProducts"

interface SellPanelProps {
    cart: ProductQuantityList,
    onChange: (item: string, value: number) => any,
    onDelete: (item: string) => any,
    cashPaid: number,
    setCashPaid: (amount: number) => any,
    creditPaid: number,
    setCreditPaid: (amount: number) => any,
    bulkTotal: number,
    setBulk: (amount: number) => any,
    setPaymentMethod: (paymentMethod: string) => any
}

export default function SellPanel ({cart, onChange, onDelete, cashPaid, setCashPaid, creditPaid, setCreditPaid, setPaymentMethod}: SellPanelProps) {
    const [error, setError] = useState<string>("")
    let sellTableEntries: Array<JSX.Element> = []
    for (let thing in cart.products) [
        sellTableEntries.push(<SellPanelEntry product={cart.products[thing]} key={cart.products[thing].product.id}
                                onDelete={(id) => {
                                    setError("")
                                    onDelete(id)
                                }}
                                onChange={(quantity) => {
                                    if (quantity > cart.products[thing].product.quantity) {
                                        setError(`Only ${cart.products[thing].product.quantity} unit(s) of ${cart.products[thing].product.description} are in inventory`)
                                    } else {
                                        setError("")
                                        onChange(thing, quantity)
                                    }
                                }}/>)
    ]

    return (
        <div className="sell-panel">
            <table className="sell-panel-table fullwidth">
                <thead>
                    <tr>
                        <td colSpan={6} className="table-title">
                            We give to customer
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
                            Price
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
                    {sellTableEntries}
                    <tr>
                        <td colSpan={5} id="sell-error" className="error-text">
                            {error} &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Total Products
                        </td>
                        <td>
                            ${Math.round(cart.priceTotal()) / 100}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Store Credit
                        </td>
                        <td colSpan={2}>
                            $<NumericEntryField step={0.01} value={creditPaid / 100} onChange={(value) => setCreditPaid(value * 100)} min={0}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Money
                        </td>
                        <td colSpan={2}>
                            $<NumericEntryField step={0.01} value={cashPaid / 100} onChange={(value) => setCashPaid(value * 100)} min={0}/>
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
    onChange: (qty: number) => any,
    onDelete: (id: string) => any
}

function SellPanelEntry ({product, onChange, onDelete}: SellPanelEntryProps) {
    let marketPrice = getMarketPrice(product.product)
    return (
        <tr>
            <td>
                {product.product.id}
            </td>
            <td>
                {product.product.description} {product.product.condition}
            </td>
            <td>
                {marketPrice === undefined ? "" : "$ " + Math.round(marketPrice) / 100}
            </td>
            <td>
                ${Math.round(product.product.sale_price) / 100}
            </td>
            <td>
                <NumericEntryField step={1} value={product.quantity} onChange={(e) => onChange(e)} min={0}/>
            </td>
            <td>
                ${Math.round(product.product.sale_price * product.quantity) / 100}
            </td>
            <td>
                <DeleteButton onClick={() => {onDelete(product.product.id)}}/>
            </td>
        </tr>
    )
}