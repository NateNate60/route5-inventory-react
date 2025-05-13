"use client"

import React from "react"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import DeleteButton from "./buttons/DeleteButton"
import WhiteTextButton from "./buttons/whitebutton"

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
                    $ {product['sale_price'] / 100}
                </td>
                <td width={"10%"} className="result-table">
                    {product["sale_price_date"].slice(0, 10)}
                </td>
                <td width={"10%"} className="result-table">
                    {product['consignor_name']}
                </td>
                <td width={"10%"} className="result-table">
                    {product['consignor_contact']}
                </td>
                
                <td width={"10%"} className="result-table">
                    <DeleteButton />
                    <WhiteTextButton text="Edit" href={`/inventory/edit?id=${product['id']}`}/>
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