"use client"

import { useState } from "react";
import TextButton from "./buttons";


export default function DeleteButton (props) {
    const [confirm, setConfirm] = useState(false)
    const [disabled, setDisabled] = useState(props.disabled ?? false)
    function handleClick () {
        if (!confirm) {
            setConfirm(true)
            return
        }
        props.onClick()
        if (! props.noDisable) {
            setDisabled(true)
        } else {
            setConfirm(false)
        }
    }


    if (disabled) {
        return (
            <button disabled className="red-button-disabled">
                Deleted
            </button>
        )
    }
    return (
        <TextButton colour="red" text={confirm ? "Confirm" : "Delete"} onClick={handleClick}/>
    )
}