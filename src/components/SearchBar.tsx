import { FormEvent } from "react"

interface SearchBarProps {
    onSubmit: (s: string) => any,
    big: boolean
}

export default function SearchBar ({onSubmit, big}: SearchBarProps) {
    return (
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            let value = e.currentTarget.elements.entry.value
            e.currentTarget.elements.entry.value = ""
            onSubmit(value)
        }}>
            <label>Scan or input bar code:</label>
            <input type="text" id="entry" className={big ? "big-input" : ""}/>
        </form>
    )
}