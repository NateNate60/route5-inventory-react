"use client"

import React, { useState } from "react"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import WhiteTextButton from "@/components/buttons/buttons"
import { Product } from "@/types/Product"
import updatePrice from "@/backend/updatePrice"
import "./inventory.css"
import NumericEntryField from "@/components/NumericEntryField"
import { getMarketPrice } from "@/backend/searchProducts"

interface ProductDisplayerProps {
    products: ProductQuantityList,
    editable: boolean,
    sort: string,
    filter: string,
    search: string
}

export default function ProductDisplayer ({products, editable, sort, filter, search}: ProductDisplayerProps) {
    let productList = Array<Product>()

    for (let productID in products.products) {
        if (products.products[productID].product.type === filter ||
            filter === "") {
            productList.push(products.products[productID].product)
        }
            
    }

    if (search !== "") {
        productList = productList.filter( (value) => `${value.tcg_price_data?.setName.toLowerCase()} ${value.tcg_price_data?.canonicalName.toLowerCase()} ${value.description.toLowerCase()} ${value.id}`.includes(search.toLowerCase()))
    }
    
    switch (sort) {
        case "abc":
            productList.sort((a, b) => a.description.localeCompare(b.description))
            break
        case "price-highest":
            productList.sort((a, b) => b.sale_price - a.sale_price)
            break
        case "date-newest":
            productList.sort((a, b) => b.acquired_date.localeCompare(a.acquired_date))
            break
        case "date-oldest":
            productList.sort((a, b) => a.acquired_date.localeCompare(b.acquired_date))
            break
        case "quantity-most":
            productList.sort((a, b) => b.quantity - a.quantity)
            break
        default:
    }

    let resultRows: Array<React.JSX.Element> = []
    for (let product of productList) {
        resultRows.push( 
            <ProductListing product={product} editable={editable} key={product.id}/>
        )
    }
            

    return (
        <table id="product-displayer">
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
                        Acquired Date
                    </th>
                    <th>
                        Market
                    </th>
                    <th>
                        Our Sale Price
                    </th>
                    <th>
                        Price date
                    </th>
                    <th>
                        Consignor
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

    let marketPrice = Math.round(getMarketPrice(product) ?? 0) / 100
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
                $ {Math.round(product['acquired_price']) / 100}
            </td>
            <td width={"10%"} className="result-table">
                {product['acquired_date'].slice(0, 10)}
            </td>
            <td>
                {marketPrice === 0 ? "" : "$" + marketPrice}
            </td>
            <td width={"7%"} className="result-table">
                $<NumericEntryField step={0.01} value={Math.round(price) / 100} onChange={(newPrice) => {setPrice(newPrice * 100)}}/>
            </td>
            <td width={"10%"} className="result-table">
                <ProductPriceDate dateString={priceDate} />
            </td>
            <td width={"10%"} className="result-table">
                {product['consignor_name']}
                <br/>
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