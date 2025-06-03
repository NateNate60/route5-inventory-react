"use client"

import { useState } from "react"

interface DateSelectorProps {
    onBeginChange: (begin: Date) => any,
    onEndChange: (end: Date) => any,
    begin: Date,
    end: Date
}

export default function DateSelector ({onBeginChange, onEndChange, begin, end}: DateSelectorProps) {
    return (
        <div>
            <table className="date-selector">
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
                            <input type="date" className="date-input" value={begin.toISOString().slice(0, 10)} onChange={ (e) => {
                                let d = new Date(e.target.value)
                                d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000)
                                onBeginChange(d)
                            }}/>
                        </td>
                        <td>
                            <input type="date" className="date-input" value={end.toISOString().slice(0, 10)} onChange={ (e) => {
                                let d = new Date(e.target.value)
                                d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000)
                                onEndChange(d)
                            }}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}