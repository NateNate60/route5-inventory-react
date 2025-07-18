"use client"

import { getBuyTransactions } from "@/backend/getTransactions"
import WhiteTextButton from "@/components/buttons/whitebutton"
import { BuyTransaction } from "@/types/Transaction"
import { JSX, useEffect, useState } from "react"

interface BuyTransactionsTableProps {
    startDate?: Date,
    endDate?: Date,
}

export default function BuyTransactonsTable ({startDate, endDate}: BuyTransactionsTableProps) {

    const [transactions, setTransactions] = useState<Array<JSX.Element>>()
    const [cashOut, setCashOut] = useState<number>(0)
    const [creditOut, setCreditOut] = useState<number>(0)

    const [currentStartDate, setCurrentStartDate] = useState<Date | undefined>(startDate)
    const [currentEndDate, setCurrentEndDate] = useState<Date | undefined>(endDate)

    useEffect( () => {
        setCurrentStartDate(startDate)
        setCurrentEndDate(endDate)
        getBuyTransactions(startDate, endDate)
        .then((value) => {
            let totalCreditOut = 0
            let totalCashOut = 0
            let txs = value.map( (tx) => {
                totalCreditOut += tx.credit_given
                totalCashOut += tx.acquired_price_total
                return <BuyTransactionEntry tx={tx} key={tx.txid}/>
            })
            setTransactions(txs)
            setCashOut(totalCashOut)
            setCreditOut(totalCreditOut)
        })
        setTransactions([ <tr key="loading"><td colSpan={4}>Loading...</td></tr>])

    }, [startDate, endDate])

    return (
        <div id="left-side">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th colSpan={2}>
                            Total $ Paid
                        </th>
                        <th colSpan={2} className="unbold">
                            ${Math.round(cashOut) / 100}
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={2}>
                            Total Store Credit Issued
                        </th>
                        <th colSpan={2} className="unbold">
                             ${Math.round(creditOut) / 100}
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
                            Items bought
                        </th>
                        <th>
                            We Paid
                        </th>
                        <th>
                            Value (at time of transaction)
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions ?? <tr><td>Loading...</td></tr>}
                </tbody>
            </table>
        </div>
    )
}

interface BuyTransactionProps {
    tx: BuyTransaction
}

function BuyTransactionEntry ({tx}: BuyTransactionProps) {
    let [expanded, setExpanded] = useState<boolean>(false)

    let maybeDetails
    if (expanded) {
        let itemRows = tx.items.map( (item, index) => <tr key={item.id} className="small">
            <td className="details-table-cell">
                {item.id}
            </td>
            <td className="details-table-cell">
                {item.quantity}
            </td>
            <td className="details-table-cell">
                {item.description}
            </td>
            <td className="details-table-cell">
                ${Math.round(item.acquired_price * item.quantity) / 100}
            </td>
            <td className="monetary details-table-cell">
                ${Math.round(item.sale_price * item.quantity) / 100}
            </td>
            <td className="monetary details-table-cell">
                {Math.round(item.acquired_price / item.sale_price * 100)}
            </td>
        </tr>)
        maybeDetails = <tr>
            <td colSpan={5} className="buy-details">
                <table className="details-table">
                    <thead>
                        <tr>
                            <th className="small">
                                Seller Name
                            </th>
                            <th colSpan={5} className="small unbold">
                                {tx.acquired_from_name}
                            </th>
                        </tr>
                        <tr>
                            <th className="small">
                                Contact Info
                            </th>
                            <th colSpan={5} className="small unbold">
                                {tx.acquired_from_contact}
                            </th>
                        </tr>
                        <tr>
                            <th className="small">
                                Payment Method
                            </th>
                            <th className="small unbold">
                                {tx.payment_method}
                            </th>
                            <th className="small">
                                Money Given
                            </th>
                            <th className="small unbold">
                                ${Math.round(tx.acquired_price_total - tx.credit_given) / 100}
                            </th>
                            <th className="small">
                                Store Credit Given
                            </th>
                            <th className="small unbold">
                                ${Math.round(tx.credit_given) / 100}
                            </th>
                        </tr>
                        <tr>
                            <td colSpan={6}>
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
                                Market
                            </th>
                            <th>
                                %
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemRows}
                    </tbody>
                </table>
            </td>
        </tr>
    }

    let maybeMore
    if (tx.items.length > 1) {
        maybeMore = <span><br/>+ {tx.items.length - 1} more</span>
    }

    let marketValue = 0
    for (let item of tx.items) {
        marketValue += item.sale_price * item.quantity
    }

    return (
        <>
            <tr>
                <td>
                    {new Date(tx.acquired_date).toLocaleString()}
                </td>
                <td>
                    {tx.items.length > 0 ? tx.items[0].description : "(bulk)"}
                    {maybeMore}
                </td>
                <td>
                    ${Math.round(tx.acquired_price_total) / 100}
                </td>
                <td>
                    ${Math.round(marketValue + tx.bulk_total) / 100}
                </td>
                <td>
                    <WhiteTextButton text={expanded ? "▼" : "▶"} onClick={() => {setExpanded(!expanded)}}/>
                </td>
            </tr>
            {maybeDetails}
        </>
    )
}