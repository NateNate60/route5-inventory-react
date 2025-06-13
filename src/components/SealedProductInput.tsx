"use client"

import getProductInfo from "@/backend/getProductInfo"
import { Product } from "@/types/Product"
import { useState } from "react"
import WhiteTextButton from "./buttons/whitebutton"
import SearchBar from "./SearchBar"

interface SealedProductInputProps {
    setProduct: (product: Product, quantity: number) => any
}

export default function SealedProductInput ({setProduct}: SealedProductInputProps) {
    const [sealedProduct, setSealedProduct] = useState<Product>()
    const [sealedPrice, setPrice] = useState<number>(0)
    const [sealedQuantity, setQuantity] = useState<number>(0)
    const [errorText, setError] = useState<string>("")
    
    let productSearchBar: React.JSX.Element

    if (sealedProduct === undefined) {
        productSearchBar = (<SearchBar onSubmit={async (barcode: string) => {
            let product = await getProductInfo(barcode)
            if ("error" in product) {
                setError(product["error"])
            } else if ("cert" in product) {
                let slab: Product = {
                    id: product["cert"],
                    type: "slab",
                    description: product["name"],
                    condition: `${product["grader"]} ${product["grade"]}`,
                    acquired_price: 0,
                    acquired_date: "",
                    sale_price: 0,
                    sale_price_date: "",
                    sale_date: "",
                    quantity: 1,
                    consignor_name: "",
                    consignor_contact: ""
                }
                setSealedProduct(slab)
                setError("")
            } else {
                setSealedProduct(product)
                setError("")
            }
        }} big={true}/>)
    } else {
        productSearchBar = <p>{sealedProduct.description}</p>
    }

    return (
        <div>
            <h2>
                Scan sealed product or PSA slabs
            </h2>
            {productSearchBar}
            <table width={"40%"}>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label>Price we paid for each</label>
                        </td>
                        <td width={"50%"}>
                            $<input type="number" id="sealedPriceInput" step={0.01} onChange={ (e) => {
                                setPrice(Number(e.target.value))
                                setError("")
                            }} value={sealedPrice}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>{sealedProduct?.type === "slab" ? "Our asking price": "Quantity"}</label>
                        </td>
                        <td>
                            {sealedProduct?.type === "slab" ? "$" : ""}
                            <input type="number" id="sealedQuantityInput" onChange={ (e) => {
                                setQuantity(Number(e.target.value))
                                setError("")
                            }} value={sealedQuantity}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <WhiteTextButton text="Add" onClick={() => {
                                if (sealedProduct !== undefined) {
                                    
                                    sealedProduct.acquired_price = sealedPrice * 100
                                    setError("")
                                    if (sealedProduct.type === "slab") {
                                        sealedProduct.sale_price = sealedQuantity * 100
                                        setProduct(sealedProduct, 1)
                                    } else {
                                        setProduct(sealedProduct, sealedQuantity)
                                    }
                                    setSealedProduct(undefined)
                                    setQuantity(0)
                                    setPrice(0)
                                } else {
                                    setError('Did you press return after entering the bar code?')
                                }
                            }}/>
                        </td>
                        <td className="error-text">
                            {errorText}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                Note: You must press return after entering the item's car code if you key it in manually. The scanner does this automatically.
                <br/>
                This is for SEALED product or PSA slabs only. If a PSA cert number is inputted, it will be looked up on the PSA database.
                <br />
                <span className="error-text">
                    Do not spam the PSA cert lookup. We are limited to 100 searches a day.
                </span>
                <br />
                Sealed product has to be already in the database. If the item ID is not found or it's a raw card/non-PSA slab, enter the product info manually below.
            </p>
        </div>
    )
}