"use client"

import { useState } from "react"

interface PaymentMethodEntryProps {
    onChange: (method: string) => any
}

export function PaymentMethodEntry ({onChange}: PaymentMethodEntryProps) {
    const [payment, setPayment] = useState<string>("cash")

    return (
        <select value={payment} onChange={(e) => {
            setPayment(e.target.value)
            onChange(e.target.value)
        }}>
            <option value="cash">Cash</option>
            <option value="card">Credit card</option>
            <option value="zelle">Zelle</option>
            <option value="venmo">Venmo</option>
            <option value="cashapp">Cash App</option>
            <option value="paypal">PayPal</option>
            <option value="tcgplayer">TCG Player</option>
            <option value="ebay">eBay</option>
        </select>
    )
}