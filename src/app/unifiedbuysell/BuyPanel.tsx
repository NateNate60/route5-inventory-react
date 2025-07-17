"use client"

import { ProductQuantity } from "@/types/Product"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { JSX, useState } from "react"
import { PaymentMethodEntry } from "./PaymentMethodEntry"
import InventorySearcher from "@/components/InventorySearcher"
import NumericEntryField from "@/components/NumericEntryField"
import DeleteButton from "@/components/buttons/DeleteButton"
import { getMarketPrice } from "@/backend/searchProducts"

interface BuyPanelProps {
    cart: ProductQuantityList,
    onChange: (item: string, attribute: "price" | "quantity", value: number) => any,
    onDelete: (item: string) => any,
    cashPaid: number,
    setCashPaid: (amount: number) => any,
    creditPaid: number
    setCreditPaid: (amount: number) => any,
    bulkTotal: number,
    setBulk: (amount: number) => any,
    setPaymentMethod: (paymentMethod: string) => any
}

export default function BuyPanel ({cart, onChange, onDelete, cashPaid, setCashPaid, creditPaid, setCreditPaid, bulkTotal, setBulk, setPaymentMethod}: BuyPanelProps) {

    let buyTableEntries: Array<JSX.Element> = []
    for (let thing in cart.products) [
        buyTableEntries.push(<BuyPanelEntry product={cart.products[thing]} key={cart.products[thing].product.id}
                              onDelete={(id) => onDelete(id)}
                              onPriceChange={(price) => onChange(thing, "price", price)}
                              onQuantityChange={(quantity) => onChange(thing, "quantity", quantity)}/>)
    ]

    return (
        <div className="buy-panel">
            <table className="buy-panel-table fullwidth">
                <thead>
                    <tr>
                        <td colSpan={6} className="table-title">
                            We receive from customer
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
                            Market Price
                        </th>
                        <th>
                            Price Ea.
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
                        <td colSpan={5}>
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Bulk
                        </td>
                        <td>
                            $<NumericEntryField step={0.01} value={bulkTotal / 100} onChange={(value) => setBulk(value * 100)} min={0}/>
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

interface BuyPanelEntryProps {
    product: ProductQuantity,
    onPriceChange: (price: number) => any,
    onQuantityChange: (qty: number) => any,
    onDelete: (id: string) => any
}

function BuyPanelEntry ({product, onPriceChange, onQuantityChange, onDelete}: BuyPanelEntryProps) {
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
                $&#8288;{marketPrice === undefined ? " unknown" : Math.round(marketPrice) / 100}
            </td>
            <td>
                $&#8288;<NumericEntryField step={0.01} value={product.product.sale_price / 100} onChange={(e) => onPriceChange(e)} min={0}/>
            </td>
            <td>
                <NumericEntryField step={1} value={product.quantity} onChange={(e) => onQuantityChange(e)} min={1}/>
            </td>
            <td>
                $&#8288;{Math.round(product.product.sale_price * product.quantity) / 100}
            </td>
            <td>
                <DeleteButton onClick={() => {onDelete(product.product.id)}}/>
            </td>
        </tr>
    )
}

