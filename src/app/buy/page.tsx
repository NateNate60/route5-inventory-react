"use client"
import "@/app/style.css"
import buyItems from "@/backend/buyItems";
import getProductInfo from "@/backend/getProductInfo";
import BackButton from "@/components/buttons/backbutton";
import GreenTextButton from "@/components/buttons/greenbutton";
import WhiteTextButton from "@/components/buttons/whitebutton";
import ProductCart from "@/components/ProductCart";
import ProductInfoForm from "@/components/ProductInfoForm";
import SearchBar from "@/components/SearchBar";
import { Product } from "@/types/Product";
import { ProductQuantityList } from "@/types/ProductQuantityList";
import { useState } from "react";


export default function BuyPage () {
    const [products, setProducts] = useState<ProductQuantityList>(new ProductQuantityList())
    const [priceTotal, setPriceTotal] = useState<number>(0)

    const [customerName, setCustomerName] = useState<string>("")
    const [customerContact, setCustomerContact] = useState<string>("")
    
    const [errorText, setErrorText] = useState<string>("")
    return (
        <div>
            <div>
                <BackButton />
            </div>
            <br/>
            <br/>
            <h1>Buy things from customers</h1>
            <div>
                <br/>
                <SealedProductInput setProduct={ (product: Product, quantity) => {
                    products.addProduct(product, false)
                    products.changeProductQuantity(product.id, quantity)
                    setPriceTotal(products.priceTotal(true))
                }}/>
            </div>
            <div>
                <br/>
                <h2>
                    Input new product
                </h2>
                <ProductInfoForm onSubmit={(product: Product) => {
                    products.addProduct(product)
                    products.changeProductQuantity(product.id, product.quantity)
                    setPriceTotal(products.priceTotal(true))
                }}/>
            </div>
            <ProductCart products={products} onDelete={(productID: string) => {
                            products.deleteProduct(productID)
                            setErrorText("")
                            setPriceTotal(products.priceTotal())
            }}/>
            <div>
                <br/>
                <p>
                    Price to be paid to customer: ${priceTotal / 100}
                    <br/>
                    What we'd get if we sold everything here at asking: ${products.priceTotal() / 100}
                    <br/>
                    Overall percentage: {Math.round(priceTotal / products.priceTotal() * 100)}%
                </p>
            </div>
            <br/>
            <label>Customer name</label>
            <input type="text" onChange={(e) => setCustomerName(e.target.value)}/>
            <br />
            <label>Customer Contact</label>
            <input type="text" onChange={(e) => setCustomerContact(e.target.value)}/>
            <GreenTextButton text="Submit Purchase" onClick={() => {
                buyItems(products, customerName, customerContact
                ).then( (json) => {
                    if ("error" in json) {
                        setErrorText(json["error"])
                    } else {
                        setErrorText(`Transaction submitted successfully. Transaction ID: ${json["txid"]}`)
                    }
                })
            }}/>
            <p className="error-text">
                {errorText}
            </p>
        </div>
    )
}

interface SealedProductInputProps {
    setProduct: (product: Product, quantity: number) => any
}

function SealedProductInput ({setProduct}: SealedProductInputProps) {
    const [sealedProduct, setSealedProduct] = useState<Product>()
    const [sealedPrice, setPrice] = useState<number>(0)
    const [sealedQuantity, setQuantity] = useState<number>(0)
    const [errorText, setError] = useState<string>("")
    
    let productSearchBar: React.JSX.Element

    if (sealedProduct === undefined) {
        productSearchBar = (<SearchBar onSubmit={async (barcode: string) => {
            let product = await getProductInfo(barcode)
            if ("error" in product) {
                setError(product["error"])
            } else {
                setSealedProduct(product)
                setError("")
            }
        }} big={true}/>)
    } else {
        productSearchBar = <p>{sealedProduct.description}</p>
    }

    return (
        <div>
            <h2>
                Scan sealed product
            </h2>
            {productSearchBar}
            <table width={"40%"}>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label>Price we paid for each</label>
                        </td>
                        <td width={"50%"}>
                            <input type="number" id="sealedPriceInput" step={0.01} onChange={ (e) => {
                                setPrice(Number(e.target.value))
                                setError("")
                            }} value={sealedPrice}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Quantity</label>
                        </td>
                        <td>
                            <input type="number" id="sealedQuantityInput" onChange={ (e) => {
                                setQuantity(Number(e.target.value))
                                setError("")
                            }} value={sealedQuantity}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <WhiteTextButton text="Add" onClick={() => {
                                if (sealedProduct !== undefined) {
                                    
                                    sealedProduct.acquired_price = sealedPrice * 100
                                    setError("")
                                    setProduct(sealedProduct, sealedQuantity)
                                    setSealedProduct(undefined)
                                } else {
                                    setError('Did you press return after entering the bar code?')
                                }
                            }}/>
                        </td>
                        <td className="error-text">
                            {errorText}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                Note: You must press return after entering the item's car code if you key it in manually. The scanner does this automatically.
                <br/>
                This is for SEALED product only. It also has to be already in the database. If the item ID is not found or it's a raw card/slab, enter the product info manually below.
            </p>
        </div>
    )
}