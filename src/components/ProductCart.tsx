"use client"

import { ProductQuantityList } from "@/types/ProductQuantityList";
import DeleteButton from "./buttons/DeleteButton"
import React, { useState } from "react";
import ProductPriceField from "./ProductPriceField";
import { Product, ProductQuantity } from "@/types/Product";
import TextButton from "./buttons/buttons";

interface ProductCartProps {
    products: ProductQuantityList,
    editable?: boolean,
    onChange?: (newValue: ProductQuantity) => any,
    onDelete: (id: string) => any
}

export default function ProductCart ({products, editable, onChange, onDelete}: ProductCartProps) {
    let productRows: Array<React.JSX.Element> = []
    for (let id in products.products) {
        let product = products.products[id]
        productRows.push(
            <ProductListing product={product} key={product.product.id} editable={editable}
                onDelete={(id) => onDelete(id)}
                onChange={(newValue) => {
                    if (onChange !== undefined) {
                        onChange(newValue)
                    }
                }}
            />
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
                        Market price
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

interface ProductListingProps {
    product: ProductQuantity,
    editable?: boolean,
    onChange?: (newValue: ProductQuantity) => any
    onDelete: (id: string) => any
}

function ProductListing ({product, editable, onChange, onDelete}: ProductListingProps) {
    const [description, setDescription] = useState<string>(product.product.description)
    const [salePrice, setSalePrice] = useState<number>(product.product.sale_price)
    const [quantityInCart, setQuantityInCart] = useState<number>(product.quantity)
    const [changed, setChanged] = useState<boolean>(false)

    let maybeEditablePrice
    let maybeEditableDescription
    let maybeEditableQuantity
    if (editable) {
        maybeEditablePrice = <input className="editable smallwidth" type="number" step="0.01" value={salePrice / 100} onChange={(e) => {
            setSalePrice(Number(e.target.value) * 100)
            setChanged(true)
        }}/>
        maybeEditableDescription = <textarea className="editable fullwidth" value={description} onChange={(e) => {
            setDescription(e.target.value)
            setChanged(true)
        }}/>
        maybeEditableQuantity = <input className="editable smallwidth" type="number" value={quantityInCart} onChange={(e) => {
            setQuantityInCart(parseInt(e.target.value))
            setChanged(true)
        }}/>
    } else {
        maybeEditablePrice = <p>{salePrice / 100}</p>
        maybeEditableDescription = <p>{description}</p>
        maybeEditableQuantity = <p>{quantityInCart}</p>
    }

    let maybeSaveButton
    if (changed && onChange !== undefined) {
        maybeSaveButton = <TextButton colour="white" text="Save" onClick={ () => {
            let newValue: ProductQuantity = {
                quantity: quantityInCart,
                product: product.product
            }
            newValue.product.sale_price = salePrice
            newValue.product.description = description
            onChange(newValue)
            setChanged(false)
        }}/>
    }
    
    return (
        <tr className="fullwidth">
            <td  width="10%">
                {product.product.id}
            </td>
            <td width="30%">
                {maybeEditableDescription}
            </td>
            <td  width="10%">
                {product.product.condition}
            </td>
            <td  width="10%">
                {product.product.quantity}
            </td>
            <td  width="10%">
                ${maybeEditablePrice}
            </td>
            <td  width="10%">
                {maybeEditableQuantity}
            </td>
            <td  width="10%">
                ${quantityInCart * salePrice / 100}
            </td>
            <td width="10%">
                {maybeSaveButton}
                <DeleteButton onClick={() => onDelete(product.product.id)}/>
            </td>
        </tr>
    )
}