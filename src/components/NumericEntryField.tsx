"use client"

interface NumericEntryFieldProps {
    step: 1 | 0.1 | 0.01,
    onChange: (value: number) => any,
    value: number,
    max?: number,
    min?: number,
    short?: boolean
}

export default function NumericEntryField ({step, onChange, value, min, max, short}: NumericEntryFieldProps) {
    return <input type="number" step={step} value={value} onFocus={(event) => event.target.select()}
            min={min} max={max}
            onChange={(e) => {
                let value = parseFloat(e.target.value)
                if (isNaN(value)) {
                    value = 0
                }
                onChange(value)
            }}
            className={`editable numeric-input ${short ? "short-numeric-input" : ""}`}/>
}