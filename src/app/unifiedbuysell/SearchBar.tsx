"use client"

import { FormEvent, useState } from "react"

interface SearchBarProps {
    onSubmit: (s: string) => void,
    onChange: (s: string) => void,
}

export default function SearchBar ({onSubmit, onChange}: SearchBarProps) {
    const [value, setValue] = useState<string>("")
    return (
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            let content = value
            setValue("")
            onSubmit(content)
        }}>
            <label>Scan bar code or input card name:</label>
            <input type="text" id="entry" className="big-input" value={value} onChange={(e) => {
                onChange(e.target.value)
                setValue(e.target.value)}}
            />
        </form>
    )
}