import { FormEvent } from "react"

interface SearchBarProps {
    onSubmit: (s: string) => any,
    big: boolean
}

export default function SearchBar ({onSubmit, big}: SearchBarProps) {
    return (
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            onSubmit(e.currentTarget.elements.entry.value)
        }}>
            <label>Scan or input bar code:</label>
            <input type="text" id="entry" className={big ? "big-input" : ""}/>
        </form>
    )
}