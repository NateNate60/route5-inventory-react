"use client"

import React, { useState } from "react"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import DeleteButton from "./buttons/DeleteButton"
import WhiteTextButton from "./buttons/whitebutton"
import { Product } from "@/types/Product"
import updatePrice from "@/backend/updatePrice"

interface ProductDisplayerProps {
    products: ProductQuantityList,
    editable: boolean
}

export default function ProductDisplayer ({products, editable = false}: ProductDisplayerProps) {
    let resultRows: Array<React.JSX.Element> = []
    for (let productID in products.products) {
        let product = products.products[productID].product
        resultRows.push( 
            <ProductListing product={product} editable={editable} key={productID}/>
        )
        
    }
    
    
    return (
        <table width={"100%"}>
            <thead>
                <tr>
                    <th>
                        Bar code
                    </th>
                    <th>
                        Item
                    </th>
                    <th>
                        Condition
                    </th>
                    <th>
                        In inventory
                    </th>
                    <th>
                        Bought for
                    </th>
                    <th>
                        Price
                    </th>
                    <th>
                        Price date
                    </th>
                    <th>
                        Consignor name
                    </th>
                    <th>
                        Consignor contact
                    </th>
                    <th>
                    </th>
                </tr>
            </thead>
            <tbody>
                {resultRows}
            </tbody>
        </table>
    )
}

interface ProductListingProps {
    product: Product,
    editable: boolean
}

function ProductListing ({product, editable}: ProductListingProps) {
    let [price, setPrice] = useState<number>(product["sale_price"])
    let [priceDate, setPriceDate] = useState<string>(product["sale_price_date"])
    return (
        <tr key={product['id']}>
            <td width={"10%"} className="result-table">
                {product['id']}
            </td>
            <td width={"20%"} className="result-table">
                {product['description']}
            </td>
            <td width={"10%"} className="result-table">
                {product['condition']}
            </td>
            <td width={"6%"} className="result-table">
                {product['quantity']}
            </td>
            <td width={'7%'} className="result-table">
                $ {product['acquired_price'] / 100}
            </td>
            <td width={"7%"} className="result-table">
                <ProductPriceField price={price} editable={editable} onChange={(newPrice) => {setPrice(newPrice)}}/>
            </td>
            <td width={"10%"} className="result-table">
                <ProductPriceDate dateString={priceDate} />
            </td>
            <td width={"10%"} className="result-table">
                {product['consignor_name']}
            </td>
            <td width={"10%"} className="result-table">
                {product['consignor_contact']}
            </td>
            
            <td width={"10%"} className="result-table">
                <WhiteTextButton text="Save" onClick={() => {
                    updatePrice(price, product["id"])
                    setPriceDate(new Date().toISOString())
                }}/>
            </td>
        </tr>
    )
}

interface ProductPriceFieldProps {
    price: number,
    editable: boolean,
    onChange: (price: number) => any
}

function ProductPriceField ({price, editable, onChange}: ProductPriceFieldProps) {
    if (editable) {
        return (
            <input type="number" step={0.01} defaultValue={price / 100} onChange={(e) => onChange(Number(e.target.value) * 100)}/>
        )
    } else {
        return (
            <span>
                ${price / 100}
            </span>
        )
    }
}

interface ProductPriceDateProps {
    dateString: string
}

function ProductPriceDate ({dateString}: ProductPriceDateProps) {
    let date = new Date(dateString)
    let today = new Date()

    return (
        <span className={today.getTime() - date.getTime() > 7 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 ? "error-text" : ""}>
            {dateString.slice(0, 10)}
        </span>
    )
}