import { useState } from "react"

interface DropdownMenuProps {
    // An array of possible options
    options: {[key: string]: string}

    // The currently selected sort
    selected?: string,

    // A callback for when the sort is changed
    onClick: (sortType: string) => any
}


export default function DropdownMenu ({options, selected, onClick}: DropdownMenuProps) {

    let optionsList = Array<React.JSX.Element>()

    for (let key in options) {
        optionsList.push(<option value={key} key={key}>{options[key]}</option>)
    }

    return (
        <select onChange={(event) => onClick(event.target.value)} value={selected}>
            {optionsList}
        </select>
    )
}