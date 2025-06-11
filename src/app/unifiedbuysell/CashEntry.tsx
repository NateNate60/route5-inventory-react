"use client"

import { useState } from "react"

interface CashEntryProps {
    onChange: (amount: number) => any
}

export default function CashEntry ({onChange}: CashEntryProps) {
    const [amount, setAmount] = useState<number|undefined>(0)

    return (
        <>
            $<input className="numeric-input" type="number" step={0.01} value={(amount ?? 0) / 100} min={0} onFocus={(event) => event.target.select()}
              onChange={(e) => {
                if (e.target.value === "") {
                    setAmount(0)
                    onChange(0)
                } else {
                    setAmount(Math.round(parseFloat(e.target.value) * 100))
                    onChange(Math.round(parseFloat(e.target.value) * 100))
                }
                
            }}/>
        </>      
    )
}

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