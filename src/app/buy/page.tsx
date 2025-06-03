"use client"

import "@/app/style.css"
import "@/app/buy/buypage.css"
import "@/app/buttons.css"
import InventorySearcher from "@/components/InventorySearcher"
import { useState } from "react"
import ProductInfoForm from "@/components/ProductInfoForm"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import ProductCart from "@/components/ProductCart"
import GreenTextButton from "@/components/buttons/greenbutton"
import buyItems from "@/backend/buyItems"
import BackButton from "@/components/buttons/backbutton"

export default function BuyPage () {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [barcode, setBarcode] = useState<string>("")
    const [cart, setCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [priceTotal, setPriceTotal] = useState<number>(0)
    const [pricePaid, setPricePaid] = useState<number>(0)
    const [sellerName, setSellerName] = useState<string>("")
    const [sellerContact, setSellerContact] = useState<string>("")
    const [errorText, setErrorText] = useState<string>("")

    let maybeText = showForm ? <p>Item not found in inventory. Enter it below.</p> : undefined
    let maybeForm = showForm ? <ProductInfoForm onSubmit={(product) => {
        cart.addProduct(product)
        setShowForm(false)
        setBarcode("")
    }} barcode={barcode}/> : undefined

    return (
        <div>
            <BackButton/>
            <br />
            <br />
            <h1>Buy products from customer</h1>
            <div className="sidebar">
                <InventorySearcher onSubmit={(result, barcode) => {
                    if ("error" in result) {
                        // Not found in inventory
                        setShowForm(true)
                        setBarcode(barcode)
                    } else if ("id" in result) {
                        // Product found
                        cart.addProduct(result, false)
                        setBarcode("")
                        setShowForm(false)
                    } else if ("cert" in result) {
                        let today = new Date()
                        cart.addProduct({
                            "acquired_date": today.toISOString(),
                            "acquired_price": 0,
                            "condition": `${result.grader} ${result.grade}`,
                            "consignor_contact": "",
                            "consignor_name": "",
                            "description": result.name,
                            "id": result.cert,
                            "quantity": 1,
                            "sale_date": "",
                            "sale_price": 0,
                            "sale_price_date": today.toISOString(),
                            "type": "slab"
                        }, false)
                        setBarcode("")
                        setShowForm(false)
                    }
                    setPriceTotal(cart.priceTotal())
                }} />
                {maybeText}
                {maybeForm}
            </div>
            <div className="cartbar">
                <ProductCart products={cart} editable={true} 
                    onChange={ (newItem) => {
                        cart.products[newItem.product.id] = newItem
                        setPriceTotal(cart.priceTotal())
                    }}
                    onDelete={ (id) => {
                        cart.deleteProduct(id)
                        setPriceTotal(cart.priceTotal())
                    }
                    }
                />
            </div>
            <div className="price-area">
                    <table>
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="price-area-table">
                                    Total Market Value
                                </td>
                                <td className="price-area-table">
                                    ${priceTotal / 100}
                                </td>
                            </tr>
                            <tr>
                                <td className="price-area-table">
                                    Percentage of Market
                                </td>
                                <td className="price-area-table">
                                    <input className="smallwidth" type="number" step={1} value={Math.round(pricePaid / priceTotal * 1000)/10}
                                    onChange={(e) => setPricePaid(Math.round(Number(e.target.value) / 100 * priceTotal))}/>%
                                </td>
                            </tr>
                            <tr>
                                <td className="price-area-table">
                                    Paid to customer
                                </td>
                                <td className="price-area-table">
                                    $<input className="smallwidth" type="number" step={0.01} value={pricePaid / 100}
                                    onChange={(e) => setPricePaid(Math.round(Number(e.target.value) * 100))}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Seller Name
                                </td>
                                <td>
                                    <input type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Seller Contact Info
                                </td>
                                <td>
                                    <input type="text" value={sellerContact} onChange={(e) => setSellerContact(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <GreenTextButton onClick={() => {
                                        buyItems(cart, pricePaid, sellerName, sellerContact)
                                        .then( (value) => {
                                            if ("error" in value) {
                                                setErrorText(value["error"])
                                            } else {
                                                // Suceeded, blank out eveything
                                                setShowForm(false)
                                                setBarcode("")
                                                setErrorText("Successfully submitted transaction!")
                                                setPricePaid(0)
                                                setPriceTotal(0)
                                                setSellerContact("")
                                                setSellerName("")
                                                setCart(new ProductQuantityList())
                                            }
                                        })
                                    }} text="Submit"/>
                                </td>
                                <td>
                                    {errorText}
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
    )
}
