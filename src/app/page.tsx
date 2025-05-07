"use client"

import React, { useState } from "react";

import GreenTextButton from "../components/buttons/greenbutton"
import BlueTextButton from "../components/buttons/bluebuttton"
import OrangeTextButton from "../components/buttons/orangebutton"
import InventorySearcher from "../components/InventorySearcher";
import "./style.css"
import TokenSetter from "../components/TokenSetter";
import ProductDisplayer from "../components/ProductDisplayer";
import {Product} from "../types/Product"

export default function Home() {
    const [items, setItems] = useState<Array<Product>>([])
    return (
        <div>
            <h1 className="page-title">Home Page</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <GreenTextButton text="Buy products from customer"/>
                        </td>
                        <td>
                            <OrangeTextButton text="Sell products to customer"/>  
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BlueTextButton text="Manage inventory"/>
                        </td>
                        <td>
                            <TokenSetter />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <InventorySearcher onSubmit={(e: Product) => {setItems([e])}}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <ProductDisplayer products={items}/>
           
        </div>
    );
}
