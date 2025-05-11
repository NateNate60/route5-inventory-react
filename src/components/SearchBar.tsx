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
            onSubmit(value)
        }}>
            <label>Scan or input bar code:</label>
            <input type="text" id="entry" className={big ? "big-input" : ""} onChange={(e) => setValue(e.target.value)}/>
        </form>
    )
}