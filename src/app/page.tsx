"use client"

import React, { useState } from "react";

import GreenTextButton from "../components/buttons/greenbutton"
import BlueTextButton from "../components/buttons/bluebuttton"
import OrangeTextButton from "../components/buttons/orangebutton"
import InventorySearcher from "../components/InventorySearcher";
import "./style.css"
import "./buttons.css"
import TokenSetter from "../components/TokenSetter";
import ProductDisplayer from "../components/ProductDisplayer";
import {Product} from "../types/Product"
import { ProductQuantityList } from "@/types/ProductQuantityList";
import WhiteTextButton from "@/components/buttons/whitebutton";

export default function Home() {
    const [items, setItems] = useState<ProductQuantityList>(new ProductQuantityList())
    const [errorText, setErrorText] = useState<string>('')
    return (
        <div>
            <h1 className="page-title">Home Page</h1>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2}>
                            <TokenSetter />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <GreenTextButton text="Buy products from customer" href="/buy"/>
                        </td>
                        <td>
                            <OrangeTextButton text="Sell products to customer" href="/sell"/>  
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BlueTextButton text="Manage inventory" href="/inventory"/>
                        </td>
                        <td>
                            <WhiteTextButton text="View transactions" href="/transactions"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <InventorySearcher onSubmit={(e) => {
                                let product = new ProductQuantityList()
                                if ("error" in e) {
                                    setErrorText(e["error"])
                                } else if ("cert" in e) {
                                    setErrorText("Slabs are not currently supported here")
                                } else {
                                    setErrorText("")
                                    product.addProduct(e, false)
                                    setItems(product)
                                }
                            }}/>
                        </td>
                        <td className="error-text">
                            {errorText}
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <ProductDisplayer products={items} editable={false}/>
           
        </div>
    );
}
