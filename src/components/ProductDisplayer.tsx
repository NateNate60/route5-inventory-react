"use client"

import React from "react"
import { ProductQuantityList } from "@/types/ProductQuantityList"

interface ProductDisplayerProps {
    products: ProductQuantityList
}

export default function ProductDisplayer ({products}: ProductDisplayerProps) {
    let resultRows: Array<React.JSX.Element> = []
    for (let productID in products.products) {
        let product = products.products[productID].product
        resultRows.push( 
            <tr key={product['id']}>
                <td width={"10%"} className="result-table">
                    {product['id']}
                </td>
                <td width={"30%"} className="result-table">
                    {product['description']}
                </td>
                <td width={"10%"} className="result-table">
                    {product['condition']}
                </td>
                <td width={"7%"} className="result-table">
                    {product['quantity']}
                </td>
                <td width={"7%"} className="result-table">
                    {products.products[productID].inCart}
                </td>
                <td width={"6%"} className="result-table">
                    $ {product['sale_price'] / 100}
                </td>
                <td width={"15%"} className="result-table">
                    {product['consignor_name']}
                </td>
                <td width={"20%"} className="result-table">
                    {product['consignor_contact']}
                </td>
            </tr>
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
                        In cart
                    </th>
                    <th>
                        Price ea.
                    </th>
                    <th>
                        Consignor name
                    </th>
                    <th>
                        Consignor contact
                    </th>
                </tr>
            </thead>
            <tbody>
                {resultRows}
            </tbody>
        </table>
    )
}