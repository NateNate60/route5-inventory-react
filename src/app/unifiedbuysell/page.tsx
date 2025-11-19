"use client"

import { useEffect, useState } from "react"
import BuyPanel from "./BuyPanel"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import "./unifiedbuysell.css"
import "@/css/style.css"
import ItemAdder from "./BuyItemAdder"
import SellPanel from "./SellPanel"
import SellItemAdder from "./SellItemAdder"
import PercentageInfo from "./PercentageInfo"
import sellItems from "@/backend/sellItems"
import buyItems from "@/backend/buyItems"
import { Product } from "@/types/Product"
import SingleProductDisplayer from "@/components/SingleProductDisplayer"
import BackButton from "@/components/buttons/backbutton"
import { refreshToken } from "@/backend/login"
import ModeSelector from "./ModeSelector"
import BulkBuyPanel from "./BulkBuyPanel"
import { getRates, getThreshhold } from "@/backend/settings"
import calculateRates from "@/backend/calculateRates"
import { getMarketPrice } from "@/backend/searchProducts"
import BulkSellPanel from "./BulkSellPanel"
import TextButton from "@/components/buttons/buttons"
import { Rates } from "@/types/Rates"

export default function UnifiedBuySellPage () {
    const [changeCounter, setChangeCounter] = useState<number>(0)

    const [mode, setMode] = useState<"buy" | "sell" | "trade" | "bulk">("sell")
    const [error, setError] = useState<string>("")
    const [adderError, setAdderError] = useState<string>("")

    const [receivedCart, setReceivedCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [receivedCredit, setReceivedCredit] = useState<number>(0)
    const [receivedCash, setReceivedCash] = useState<number>(0)
    const [receivedPaymentMethod, setReceivedPaymentMethod] = useState<string>("cash")

    const [lastScan, setLastScan] = useState<Product>()
    
    const [givenCart, setGivenCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [givenCredit, setGivenCredit] = useState<number>(0)
    const [givenCash, setGivenCash] = useState<number>(0)
    const [givenPaymentMethod, setGivenPaymentMethod] = useState<string>("cash")

    const [rates, setRates] = useState<Rates>()
    const [threshhold, setThreshhold] = useState<number>(NaN)

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)

        getRates(
        ).then( (r) => setRates(r))
        
        getThreshhold(
        ).then( (r) => setThreshhold(r))

        return () => clearInterval(interval);
    }, [])

    function clearAll () {
        setReceivedCart(new ProductQuantityList())
        setReceivedCredit(0)
        setReceivedCash(0)

        setGivenCart(new ProductQuantityList())
        setGivenCash(0)
        setGivenCredit(0)
    }

    let maybeBuySide, maybeSellSide
    if (mode === "bulk" && rates !== undefined) {
        maybeBuySide = <div id={"bulk"}>
            <BulkBuyPanel cart={receivedCart}
                    cashPaid={givenCash}
                    threshhold={threshhold}
                    setCashPaid={setGivenCash} 
                    creditPaid={givenCredit}
                    changeRate={(id, cashRate, creditRate) => {
                        receivedCart.changeRate(id, cashRate, creditRate)
                        setChangeCounter(changeCounter + 1)
                    }}
                    setCreditPaid={setGivenCredit}
                    setPaymentMethod={setGivenPaymentMethod}
                    changeBarcode={ (oldBarcode, newBarcode) => receivedCart.changeBarcode(oldBarcode, newBarcode)}
                    onDelete={(id) => {
                        receivedCart.deleteProduct(id)
                        setChangeCounter(changeCounter + 1)
                    }}
                />
            <ItemAdder mode="buy" onSubmit={(product) => {
                receivedCart.addProduct(product, false, rates)
                setLastScan(product)
                setChangeCounter(changeCounter + 1)
            }}/>
        </div>
    } else if (mode === "sell") {
        maybeSellSide = <div id={"bulk"}>
            <BulkSellPanel cart={givenCart} 
                    cashPaid={receivedCash}
                    setCashPaid={setReceivedCash} 
                    creditPaid={receivedCredit}
                    setCreditPaid={setReceivedCredit}
                    setPaymentMethod={setReceivedPaymentMethod}
                    onDelete={(id) => {
                        givenCart.deleteProduct(id)
                        setChangeCounter(changeCounter + 1)
                    }}
                />
            <ItemAdder mode="sell" errorText={adderError} onSubmit={(product) => {
                let enoughStock = givenCart.addProduct(product, true)
                if (!enoughStock) {
                    setAdderError(`Only ${product.quantity} unit(s) of ${product.description} are available`)
                } else {
                    setAdderError("")
                }
                setLastScan(product)
                setChangeCounter(changeCounter + 1)
            }}/>
        </div>
    }

    return (
        <div>
            <BackButton/>
            <h1 id="page-title">Record New Transaction</h1>
            <ModeSelector onClick={(mode) => {
                    setMode(mode)
                    clearAll()
                }}/>
            <div id="panels">
                {maybeBuySide}
                {maybeSellSide}
            </div>
            <div id="summary">
                <h3>Last Scanned Item</h3>
                <SingleProductDisplayer product={lastScan} editable={false}/>
                <hr/>
                <PercentageInfo buyCards={receivedCart.priceTotal()} buyCash={receivedCash} buyCredit={receivedCredit}
                    sellCards={givenCart.priceTotal()} sellCash={givenCash} sellCredit={givenCredit}
                />
                <p className="error-text">
                    {error}
                </p>
                <div id="submit">
                    <TextButton colour="white" text="Submit Transaction" onClick={async () => {
                        
                        if (mode === "bulk") {
                            let threshhold = await getThreshhold()

                            // Validate that everything which should have an asset tag does have an asset tag
                            for (let itemID in receivedCart.products) {
                                if (itemID[0] === "B" && (getMarketPrice(receivedCart.products[itemID].product) ?? 0) > threshhold) {
                                    // something that should have an asset tag, does not
                                    setError(`Assign an asset tag to ${receivedCart.products[itemID].product.description}`)
                                    return
                                }
                            }

                            buyItems(receivedCart, givenCash, givenCredit, givenPaymentMethod, threshhold)

                        } else {
                            sellItems(givenCart, receivedCash, receivedCredit, receivedPaymentMethod)
                        }

                        clearAll()
                    }}/>
                </div>
                
            </div>
        </div>
    )
}