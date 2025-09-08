"use client"

import "@/css/style.css"
import "@/css/small.css"
import "./transactions.css"
import BuyTransactonsTable from "./BuyTransactionsTable"
import SellTransactonsTable from "./SellTransactionsTable"
import SearchOptions from "./SearchOptions"
import { useEffect, useState } from "react"
import BackButton from "@/components/buttons/backbutton"
import { refreshToken } from "@/backend/login"

export default function TransactionsPage () {
    // These initialise to last/next midnight today
    const [startDate, setStartDate] = useState<Date>(() => {let d = new Date(); d.setHours(0,0,0,0); return d})
    const [endDate, setEndDate] = useState<Date>(() => {let d = new Date(); d.setHours(24,0,0,0); return d})

    const [query, setQuery] = useState<string>("")

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    }, [])
    return (
        <div>
            <BackButton />
            <h1 id="page-title">View Transaction Records</h1>
            <SearchOptions start={startDate} end={endDate} query={query} onChange={ (begin, end) => {
                setStartDate(begin)
                setEndDate(end)
            }} setQuery={setQuery}/>
            <BuyTransactonsTable startDate={startDate} endDate={endDate} query={query}/>
            <SellTransactonsTable startDate={startDate} endDate={endDate} query={query}/>
        </div>
    )   
}