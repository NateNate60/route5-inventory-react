import { useState } from "react";
import RedTextButton from "./redbutton";


export default function DeleteButton (props) {
    const [confirm, setConfirm] = useState(false)
    const [disabled, setDisabled] = useState(props.disabled ?? false)
    function handleClick () {
        if (!confirm) {
            setConfirm(true)
            return
        }
        props.onClick()
        setDisabled(true)
    }


    if (disabled) {
        return (
            <button disabled className="red-button-disabled">
                Deleted
            </button>
        )
    }
    return (
        <RedTextButton text={confirm ? "Confirm" : "Delete"} onClick={handleClick}/>
    )
}