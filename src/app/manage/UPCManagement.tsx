"use client"

import associateUPC from "@/backend/associateUPC"
import searchProducts from "@/backend/searchProducts"
import { TCGProductData, TCGSealedData } from "@/types/Product"
import { useState } from "react"

export default function UPCManagement () {
    const [products, setProducts] = useState<Array<TCGProductData>>([])

    let upcListings = products.map( (product) => <UPCEntry key={product.tcgID} product={product} disabled={product.number?.length === 12}/>)

    return <div id="upc-management" className="management-section">
        <h2 className="section-title">Associate UPCs with Products</h2>
        <form>
            <table id="upc-table" className="fullwidth">
                <thead>
                    <tr>
                        <th>
                            Search Product Name
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="text" onChange={ (e) => {
                                if (e.target.value.length > 2) {
                                    searchProducts(e.target.value, "sealed"
                                    ).then( (result) => setProducts(result))
                                }
                                
                            }}/>
                        </td>
                        <th>UPC</th>
                    </tr>
                    {upcListings}
                </tbody>
            </table>
        </form>
    </div>
}

interface UPCEntryProps {
    product: TCGProductData,
    disabled: boolean
}

function UPCEntry ({product, disabled}: UPCEntryProps) {
    const [isError, setError] = useState<boolean>(false)
    return <tr>
        <td>{product.canonicalName}</td>
        <td><input defaultValue={product.number} className={isError ? "error-text" : ""} disabled={disabled} onChange={(e) => {
            if (e.target.value.length === 12 && e.target.value.match(/^\d{12}$/)) {
                setError(false)
                associateUPC(product.tcgID, e.target.value)
            } else {
                setError(true)
            }
        }}/></td>
    </tr>
}