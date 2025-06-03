interface ProductPriceFieldProps {
    price: number,
    editable: boolean,
    onChange: (price: number) => any
}

export default function ProductPriceField ({price, editable, onChange}: ProductPriceFieldProps) {
    if (editable) {
        return (
            <input className="only-bottom-border" type="number" step={0.01} defaultValue={price / 100} onChange={(e) => onChange(Number(e.target.value) * 100)}/>
        )
    } else {
        return (
            <span>
                ${price / 100}
            </span>
        )
    }
}