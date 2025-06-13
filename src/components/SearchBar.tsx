"use client"

import { FormEvent, useState } from "react"

interface SearchBarProps {
    onSubmit: (s: string) => any,
    big: boolean
}

export default function SearchBar ({onSubmit, big}: SearchBarProps) {
    const [value, setValue] = useState<string>("")
    return (
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            let content = value
            setValue("")
            onSubmit(content)
        }}>
            <label>Scan or input bar code:</label>
            <input type="text" id="entry" className={big ? "big-input" : ""} onChange={(e) => setValue(e.target.value)} value={value}/>
        </form>
    )
}