import { ProductQuantityList } from "@/types/ProductQuantityList";
import DeleteButton from "./buttons/DeleteButton"
import React from "react";

interface ProductCartProps {
    products: ProductQuantityList,
    onDelete: (productID: string) => void
}

export default function ProductCart ({products, onDelete}: ProductCartProps) {
    let productRows: Array<React.JSX.Element> = []
    for (let id in products.products) {
        let product = products.products[id]
        productRows.push(
            (
                <tr key={product.product.id} className="result-table">
                    <td width={"15%"}>
                        {product.product.id}
                    </td>
                    <td width={"25%"}>
                        {product.product.description}
                    </td>
                    <td width={"10%"}>
                        {product.product.condition}
                    </td>
                    <td width={"10%"}>
                        {product.product.quantity}
                    </td>
                    <td width={"10%"}>
                        ${product.product.sale_price / 100}
                    </td>
                    <td width={"10%"}>
                        {product.inCart}
                    </td>
                    <td width={"10%"}>
                        ${product.inCart * product.product.sale_price / 100}
                    </td>
                    <td width={"10%"}>
                        <DeleteButton onClick={ () => {onDelete(product.product.id)} }/>
                    </td>
                </tr>
            )
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
                        In stock
                    </th>
                    <th>
                        Asking price
                    </th>
                    <th>
                        Qty. in cart
                    </th>
                    <th>
                        Total price
                    </th>
                    <th>

                    </th>
                </tr>
            </thead>
            <tbody>
                {productRows}
            </tbody>
        </table>
    )
}