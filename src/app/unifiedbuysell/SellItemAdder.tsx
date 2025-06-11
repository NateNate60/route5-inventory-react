import InventorySearcher from "@/components/InventorySearcher"
import { Product } from "@/types/Product"
import { useState } from "react"

interface SellItemAdderProps {
    onSubmit: (item: Product) => any
}

export default function SellItemAdder ({onSubmit}: SellItemAdderProps) {
    const [maybeError, setError] = useState<string>("")
    return (
        <div className="sell-panel">
            <h3>Add item to be sold to customer</h3>
            <br/>
            <p className="error-text">
                {maybeError}
            </p>
            <InventorySearcher onSubmit={(item) => {
                if ("error" in item) {
                    // Item not found
                    setError(item.error)
                } else if ("id" in item) {
                    // Item found
                    if (item.quantity === 0) {
                        // No units in stock
                        setError(`There are no units of ${item.description} in stock.`)
                    } else {
                        onSubmit(item)
                        setError("")
                    }
                    
                } else {
                    // This is a cert but not in the DB
                    setError(`${item.name} is not in inventory`)
                }
            }}/>
        </div>
    )
}