"use client"

import "@/app/style.css"
import "@/app/small.css"
import "@/app/buttons.css"
import "./transactions.css"
import BuyTransactonsTable from "./BuyTransactionsTable"
import SellTransactonsTable from "./SellTransactionsTable"
import DateSelector from "./DateSelector"
import { useEffect, useState } from "react"
import BackButton from "@/components/buttons/backbutton"
import { refreshToken } from "@/backend/login"
import LoginWidget from "@/components/LoginWidget"

export default function TransactionsPage () {
    // These initialise to last/next midnight today
    const [startDate, setStartDate] = useState<Date>(() => {let d = new Date(); d.setHours(0,0,0,0); return d})
    const [endDate, setEndDate] = useState<Date>(() => {let d = new Date(); d.setHours(24,0,0,0); return d})

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    })
    return (
        <div>
            <BackButton />
            <h1 id="page-title">View Transaction Records</h1>
            <DateSelector start={startDate} end={endDate} onChange={ (begin, end) => {
                setStartDate(begin)
                setEndDate(end)
            }}/>
            <BuyTransactonsTable startDate={startDate} endDate={endDate}/>
            <SellTransactonsTable startDate={startDate} endDate={endDate}/>
        </div>
    )   
}