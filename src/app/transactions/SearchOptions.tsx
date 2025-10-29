"use client"

import WhiteTextButton from "@/components/buttons/buttons"
import { useState } from "react"

interface DateSelectorProps {
    onChange: (start: Date, end: Date) => void,
    setQuery: (query: string) => void,
    query: string,
    start: Date,
    end: Date
}

export default function SearchOptions ({onChange, setQuery, query, start, end}: DateSelectorProps) {
    const [startDate, setStartDate] = useState<string>(start.toISOString().slice(0, 10))
    const [endDate, setEndDate] = useState<string>(end.toISOString().slice(0, 10))
    const [changed, setChanged] = useState<boolean>(false)

    let maybeApplyButton
    if (changed) {
        maybeApplyButton = <WhiteTextButton text="Apply" onClick={() => {
            let s = new Date(startDate)
            let e = new Date(endDate)
            s.setTime(s.getTime() + s.getTimezoneOffset() * 60 * 1000)
            e.setTime(e.getTime() + e.getTimezoneOffset() * 60 * 1000)
            setChanged(false)
            onChange(s, e)
        }}/>
    }

    let maybeSortOptions
    if (!changed) {
        maybeSortOptions = <span>
            <WhiteTextButton text="Show this month" onClick={ () => {
                let today = new Date()
                let s = new Date(today.getFullYear(), today.getMonth(), 1);
                s.setTime(s.getTime() + s.getTimezoneOffset() * 60 * 1000)
                let e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                e.setTime(e.getTime() + e.getTimezoneOffset() * 60 * 1000)

                setStartDate(s.toISOString().slice(0, 10))
                setEndDate(e.toISOString().slice(0, 10))
                onChange(s, e)
            }}/>
            <WhiteTextButton text="Show last month" onClick={ () => {
                let today = new Date()
                let s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                s.setTime(s.getTime() + s.getTimezoneOffset() * 60 * 1000)
                let e = new Date(today.getFullYear(), today.getMonth(), 0);
                e.setTime(e.getTime() + e.getTimezoneOffset() * 60 * 1000)

                setStartDate(s.toISOString().slice(0, 10))
                setEndDate(e.toISOString().slice(0, 10))
                onChange(s, e)
            }}/>
        </span>
    }

    return (
        <div>
            <table id="date-selector">
                <thead>
                    <tr>
                        <th>
                            Begin
                        </th>
                        <th>
                            End
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="date" className="date-input" value={startDate} onChange={ (e) => {
                                setStartDate(e.target.value)
                                setChanged(true)
                            }}/>
                        </td>
                        <td>
                            <input type="date" className="date-input" value={endDate} onChange={ (e) => {
                                setEndDate(e.target.value)
                                setChanged(true)
                            }}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="date-selector-apply">
                            {maybeApplyButton}
                            {maybeSortOptions}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <th colSpan={2}>
                            Seach for specific items bought or sold
                        </th>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <input id="search-bar" value={query} onChange={(e) => setQuery(e.target.value)}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}