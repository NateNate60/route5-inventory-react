import { FormEvent, useState } from "react"
import GreenTextButton from "./buttons/greenbutton"

interface PriceEntryProps {
    onSubmit: (price: number) => void
}

export default function PriceEntry ({onSubmit}: PriceEntryProps) {
    let [pricePaid, setPricePaid] = useState<number>(0)
    return (
        <div>
            <form onSubmit={ () => {onSubmit(pricePaid)}}>
                <label>Input total price paid: $</label>
                <input type="number" step={0.01} value={pricePaid} id="pricePaid" onChange={(e) => {
                    setPricePaid(Number(e.target.value))
                }}/>
                <GreenTextButton text="Submit" onClick={ () => {
                    onSubmit(pricePaid)
                }}/>
            </form>
        </div>
    )
}