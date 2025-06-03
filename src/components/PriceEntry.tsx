import { FormEvent, useState } from "react"
import GreenTextButton from "./buttons/greenbutton"

interface PriceEntryProps {
    onSubmit: (moneyReceived: number, creditApplied: number, paymentMethod: string) => void
}

export default function PriceEntry ({onSubmit}: PriceEntryProps) {
    const [pricePaid, setPricePaid] = useState<number>(0)
    const [creditApplied, setCreditApplied] = useState<number>(0)
    const [paymentMethod, setPaymentMethod] = useState<string>("cash")
    return (
        <div>
            <form onSubmit={ () => {onSubmit(pricePaid, creditApplied, paymentMethod)}}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label>Total Price</label>
                            </td>
                            <td>
                                <input type="number" step={0.01} value={pricePaid} id="pricePaid" onChange={(e) => {
                            setPricePaid(Number(e.target.value))
                        }}/>
                            </td>
                            
                        </tr>
                        <tr>
                            <td>
                                <label>Applied Credit</label>
                            </td>
                            <td>
                                <input type="number" step={0.01} value={creditApplied} id="creditApplied" onChange={(e) => {
                                    setCreditApplied(Number(e.target.value))
                                }}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            </td>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Customer Pays:
                            </td>
                            <td>
                                ${pricePaid - creditApplied}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Payment Method
                            </td>
                            <td>
                                <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                                    <option value={"cash"}>Cash</option>
                                    <option value={"zelle"}>Zelle</option>
                                    <option value={"paypal"}>PayPal</option>
                                    <option value={"venmo"}>Venmo</option>
                                    <option value={"cashapp"}>Cash App</option>
                                    <option value={"card"}>Credit Card</option>
                                </select>
                            </td>
                        </tr>
                        
                        <tr>
                            <td>
                                <GreenTextButton text="Submit" onClick={ () => {
                                    onSubmit(pricePaid, 0, paymentMethod)
                                }}/>
                            </td>
                            
                        </tr>
                        
                        
                        
                    </tbody>
            </table>
            </form>
        </div>
    )
}