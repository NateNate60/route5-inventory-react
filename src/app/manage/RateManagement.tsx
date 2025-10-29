"use client"

import { getRates } from "@/backend/settings"
import updateRates from "@/backend/updateRates"
import TextButton from "@/components/buttons/buttons"
import NumericEntryField from "@/components/NumericEntryField"
import { Rates } from "@/types/Rates"
import { useEffect, useState } from "react"

export default function RateManagement () {

    const [rates, setRates] = useState<Rates>()
    const [changed, setChanged] = useState<boolean>(false)
    const [errorText, setError] = useState<string>("")

    // invisible counter needed to cause redraw
    const [counter, setCounter] = useState<number>(0)

    useEffect( () => {
        getRates(
        ).then((r) => setRates(r))
    }, [])

    

    return <div className="management-section">
        <h2 className="section-title">Manage Buy Rates</h2>
        <p className="explanation-text">
            Change the rates that the system should suggest as prices to pay in the Bulk Buyer. Note that the exact upper bound of each tier is NOT included in that tier, but rather, belongs to the next tier up.
        </p>
        <CardRateDisplayer rates={rates} showSaveButton={changed} onChange={(newRates) => {
            setCounter(counter + 1)
            setChanged(true)
            setError("")
            setRates(newRates)}}
        onSave={ () => {
            if (rates !== undefined) {
                let max = 0
                for (let threshhold of rates.cutoffs.card) {
                    if (threshhold <= max) {
                        setError("Tier threshholds must be in strictly ascending order and not negative.")
                        return
                    }
                    max = threshhold
                }
                for (let rate of rates.cashRates.card) {
                    if (rate < 0) {
                        setError("Rates cannot be negative.")
                        return
                    }
                }
                for (let rate of rates.creditRates.card) {
                    if (rate < 0) {
                        setError("Rates cannot be negative.")
                        return
                    }
                }
                updateRates(rates)
                setChanged(false)
            }
            
        }}/>
        <p className="error-text explanation-text">
            {errorText}
        </p>
    </div>
}

interface RateDisplayerProps {
    onChange: (newRates: Rates) => void,
    showSaveButton: boolean,
    rates?: Rates,
    onSave: () => void
}

function CardRateDisplayer ({rates, showSaveButton, onChange, onSave}: RateDisplayerProps) {
    if (rates === undefined) {
        return <p>Loading...</p>
    }

    let maybeSaveButton = undefined
    if (showSaveButton) {
        maybeSaveButton = <TextButton colour="white" text="Save" onClick={onSave}/>
    }

    let tiers = rates.cutoffs.card
    let rows = tiers.map( (value, index) => {
        return <tr key={index}>
            <td>
                $&nbsp;{index === 0 ? 0 : Math.round(tiers[index - 1]) / 100}&ndash;$&nbsp;<NumericEntryField value={Math.round(tiers[index]) / 100} step={0.01} onChange={(val) => {
                    let newRates = rates
                    newRates.cutoffs.card[index] = Math.round(val * 100)
                    onChange(newRates)
                }}/>
            </td>
            <td>
                <NumericEntryField value={Math.round(rates.cashRates.card[index] * 100)} step={1} onChange={(val) => {
                    let newRates = rates
                    newRates.cashRates.card[index] = Math.round(val) / 100
                    onChange(newRates)
                }}/>%
            </td>
            <td>
                <NumericEntryField value={Math.round(rates.creditRates.card[index] * 100)} step={1} onChange={(val) => {
                    let newRates = rates
                    newRates.creditRates.card[index] = Math.round(val) / 100
                    onChange(newRates)
                }}/>%
            </td>
        </tr>
    })

    rows.push(<tr key={tiers.length}>
            <td>
                ${Math.round(tiers[tiers.length - 1]) / 100} and up
            </td>
            <td>
                <NumericEntryField value={Math.round(rates.cashRates.card[tiers.length] * 100)} step={1} onChange={(val) => {
                    let newRates = rates
                    newRates.cashRates.card[tiers.length] = Math.round(val) / 100
                    onChange(newRates)
                }}/>%
            </td>
            <td>
                <NumericEntryField value={Math.round(rates.creditRates.card[tiers.length] * 100)} step={1} onChange={(val) => {
                    let newRates = rates
                    newRates.creditRates.card[tiers.length] = Math.round(val) / 100
                    onChange(newRates)
                }}/>%
            </td>
        </tr>)

    return <table className="fullwidth">
        <thead>
            <tr>
                <th>
                    Price range
                </th>
                <th>
                    Cash rate
                </th>
                <th>
                    Store credit rate
                </th>
            </tr>
        </thead>
        <tbody>
            {rows}
            <tr>
                <td>
                    {maybeSaveButton}
                </td>
                <td>
                </td>
                <td>
                    <TextButton colour="white" text="Add row" onClick={() => {
                        let newRates = rates
                        newRates.cutoffs.card.push(rates.cutoffs.card[rates.cutoffs.card.length - 1] + 1)
                        newRates.cashRates.card.push(0)
                        newRates.creditRates.card.push(0)
                        onChange(newRates)
                    }}/>
                </td>
            </tr>
        </tbody>
    </table>
}