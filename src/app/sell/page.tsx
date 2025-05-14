"use client"

import React, {useState} from "react"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { Product } from "@/types/Product"
import SearchBar from "@/components/SearchBar"
import getProductInfo from "@/backend/getProductInfo"
import ProductCart from "@/components/ProductCart"

import "@/app/style.css"
import BackButton from "@/components/buttons/backbutton"
import PriceEntry from "@/components/PriceEntry"
import sellItems from "@/backend/sellItems"
import { BackendAPIError } from "@/types/BackendAPIError"


export default function SellPage () {
    const [products, setProducts] = useState<ProductQuantityList>(new ProductQuantityList())
    const [priceTotal, setPriceTotal] = useState<number>(0)
    const [errorText, setErrorText] = useState<string>("")
    return (
        <div>
            <div>
                <BackButton />
            </div>
            <div>
                <SearchBar big={true} onSubmit={(entry: string) => {
                    getProductInfo(entry).then( (product) => {
                        if ("cert" in product) {
                            setErrorText(`${product["name"]} is not in inventory`)
                            return
                        }
                        if ("error" in product) {
                            let err = product["error"]
                            setErrorText(err)
                        } else if (products.addProduct(product)) {
                            setPriceTotal(products.priceTotal())
                            setErrorText("")
                        } else {
                            setErrorText(`There is only ${product.quantity} of product "${product.description}" in stock.`)
                        }
                    } )
                }}/>
            </div>
            <br />
            <ProductCart products={products} onDelete={(productID: string) => {
                products.deleteProduct(productID)
                setErrorText("")
                setPriceTotal(products.priceTotal())
            }}/>
            <br />
            <p className="error-text">
                {errorText}
            </p>
            <p>
                Price total: ${priceTotal / 100}
            </p>
            <br/>
            <PriceEntry onSubmit={(price: number) => {
                if (Number.isNaN(price)) {
                    setErrorText("Please enter a decimal number.")
                } else {
                    sellItems(products, price * 100, (txid) =>
                    {
                        setErrorText(`Transaction succeeded with transaction ID ${txid}`)
                        setPriceTotal(0)
                        setProducts(new ProductQuantityList())
                    })
                }
            }}/>
        </div>
    )
}