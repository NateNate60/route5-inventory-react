"use client"

import React from "react"
import constants from "./constants.json"
import {Product} from "../types/Product"

interface ProductDisplayerProps {
    products: Array<Product>
}

export default function ProductDisplayer ({products}: ProductDisplayerProps) {
    let resultRows = products.map( (product) => <tr>
        <td width={"15%"} className="result-table">
            {product['id']}
        </td>
        <td width={"30%"} className="result-table">
            {product['description']}
        </td>
        <td width={"10%"} className="result-table">
            {product['condition']}
        </td>
        <td width={"5%"} className="result-table">
            {product['quantity']}
        </td>
        <td width={"5%"} className="result-table">
            $ {product['sale_price'] / 100}
        </td>
        <td width={"20%"} className="result-table">
            {product['consignor_name']}
        </td>
        <td width={"20%"} className="result-table">
            {product['consignor_contact']}
        </td>
    </tr>)
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
                        Qty.
                    </th>
                    <th>
                        Price
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