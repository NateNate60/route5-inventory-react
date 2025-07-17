"use client"

import { getSellTransactions } from "@/backend/getTransactions"
import WhiteTextButton from "@/components/buttons/whitebutton"
import { SaleTransaction } from "@/types/Transaction"
import React, { JSX, useEffect, useState } from "react"

interface SellTransactionsTableProps {
    startDate?: Date,
    endDate?: Date
}

export default function SellTransactonsTable ({startDate, endDate}: SellTransactionsTableProps) {
    const [transactions, setTransactions] = useState<Array<JSX.Element>>()
    const [creditIn, setCreditIn] = useState<number>(0)
    const [cashIn, setCashIn] = useState<number>(0)

    const [currentStartDate, setCurrentStartDate] = useState<Date | undefined>(startDate)
    const [currentEndDate, setCurrentEndDate] = useState<Date | undefined>(endDate)

    useEffect(() => {
        setCurrentStartDate(startDate)
        setCurrentEndDate(endDate)
        getSellTransactions(startDate, endDate)
        .then((value) => {
            let totalCreditIn = 0
            let totalCashIn = 0
            let txs = value.map( (tx) => {
                totalCreditIn += tx.credit_applied
                totalCashIn += tx.sale_price_total
                return <SaleTransactionEntry tx={tx} key={tx.txid}/>
            })
            setTransactions(txs)
            setCashIn(totalCashIn)
            setCreditIn(totalCreditIn)
        })
        setTransactions([ <tr key="loading"><td colSpan={4}>Loading...</td></tr>])
    }, [startDate, endDate])

    return (
        <div id="right-side">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th colSpan={2}>
                            Total $ Received
                        </th>
                        <th colSpan={2} className="unbold">
                            ${Math.round(cashIn) / 100}
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={2}>
                            Total Store Credit Received
                        </th>
                        <th colSpan={2} className="unbold">
                             ${Math.round(creditIn) / 100}
                        </th>
                    </tr>
                    <tr>
                        <th>
                            &nbsp;
                        </th>
                    </tr>
                    <tr>
                        <th>
                            When
                        </th>
                        <th>
                            Items sold
                        </th>
                        <th>
                            Amount Received
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions}
                </tbody>
            </table>
        </div>
    )
}

interface SaleTransactionEntryProps {
    tx: SaleTransaction
}

function SaleTransactionEntry ({tx}: SaleTransactionEntryProps) {
    const [expanded, setExpanded] = useState<boolean>(false)

    let maybeMore
    if (tx.items.length > 1) {
        maybeMore = <span><br/>+ {tx.items.length - 1} more</span>
    }

    let maybeDetails
    if (expanded) {
        let buyPriceTotal = 0
        let detailRows = tx.items.map( (value, index) => {
            buyPriceTotal += value.acquired_price * value.quantity
            return <tr key={value.id}>
                <td className="small">
                    {value.id}
                </td>
                <td className="small">
                    {value.quantity}
                </td>
                <td className="small">
                    {value.description}
                </td>
                <td className="small">
                    ${Math.round(value.acquired_price * value.quantity) / 100}
                </td>
                <td className="small monetary">
                    ${Math.round(value.sale_price * value.quantity) / 100}
                </td>
            </tr>
        })
        maybeDetails = <tr>
            <td colSpan={4} className="sell-details">
                <table className="details-table">
                    <thead>
                        <tr>
                            <th colSpan={2} className="small">
                                Payment method
                            </th>
                            <th className="small unbold">
                                {tx.payment_method}
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={2} className="small">
                                Profit
                            </th>
                            <th className="small unbold">
                                ${Math.round(tx.sale_price_total - buyPriceTotal) / 100}
                            </th>
                        </tr>
                        <tr>
                            <th colSpan={2} className="small">
                                Money received
                            </th>
                            <th className="small unbold">
                                ${Math.round(tx.sale_price_total - tx.credit_applied) / 100}
                            </th>
                            <th className="small">
                                Store credit applied
                            </th>
                            <th className="small unbold">
                                ${Math.round(tx.credit_applied) / 100}
                            </th>
                        </tr>
                        <tr>
                            <td colSpan={5}>
                                <hr/>
                            </td>
                        </tr>
                        <tr>
                            <th className="small">
                                Bar code
                            </th>
                            <th className="small">
                                Qty
                            </th>
                            <th className="small">
                                Item name
                            </th>
                            <th className="small">
                                We paid
                            </th>
                            <th className="small">
                                Sale price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailRows}
                    </tbody>
                </table>
            </td>
        </tr>
    }
    return (
        <>
        <tr>
            <td>
                {new Date(tx.sale_date).toLocaleString()}
            </td>
            <td>
                {tx.items[0].description}
                {maybeMore}
            </td>
            <td>
                ${Math.round(tx.sale_price_total) / 100}
            </td>
            <td>
                <WhiteTextButton text={expanded ? "▼" : "▶"} onClick={ () => setExpanded(!expanded)}/>
            </td>
        </tr>
        {maybeDetails}
        </>
    )
}