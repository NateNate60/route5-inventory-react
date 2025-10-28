"use client"

import { useEffect, useState } from "react"
import BuyPanel from "./BuyPanel"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import "./unifiedbuysell.css"
import "@/css/style.css"
import BuyItemAdder from "./BuyItemAdder"
import SellPanel from "./SellPanel"
import SellItemAdder from "./SellItemAdder"
import PercentageInfo from "./PercentageInfo"
import WhiteTextButton from "@/components/buttons/whitebutton"
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

export default function UnifiedBuySellPage () {
    const [changeCounter, setChangeCounter] = useState<number>(0)

    const [mode, setMode] = useState<"buy" | "sell" | "trade" | "bulk">("sell")
    const [error, setError] = useState<string>("")

    const [buyCart, setBuyCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [buyCards, setBuyCards] = useState<number>(0)
    const [buyCredit, setBuyCredit] = useState<number>(0)
    const [buyCash, setBuyCash] = useState<number>(0)
    const [buyPaymentMethod, setBuyPaymentMethod] = useState<string>("cash")
    const [buyBulk, setBuyBulk] = useState<number>(0)

    const [lastScan, setLastScan] = useState<Product>()
    
    const [sellCart, setSellCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [sellCards, setSellCards] = useState<number>(0)
    const [sellCredit, setSellCredit] = useState<number>(0)
    const [sellCash, setSellCash] = useState<number>(0)
    const [sellPaymentMethod, setSellPaymentMethod] = useState<string>("cash")
    const [sellBulk, setSellBulk] = useState<number>(0)

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    }, [])

    function clearAll () {
        setBuyCart(new ProductQuantityList())
        setBuyCards(0)
        setBuyCash(0)
        setBuyCredit(0)

        setSellCart(new ProductQuantityList())
        setSellCards(0)
        setSellCash(0)
        setSellCredit(0)
    }

    let maybeBuySide, maybeSellSide
    if (mode === "buy" || mode === "trade") {
        maybeBuySide = <div id={mode === "trade" ? "buy-side" : undefined}>
                <BuyPanel cart={buyCart} 
                    cashPaid={mode === "buy" ? sellCash : buyCash}
                    setCashPaid={mode === "buy" ? setSellCash : setBuyCash} 
                    creditPaid={mode === "buy" ? sellCredit : buyCredit}
                    setCreditPaid={mode === "buy" ? setSellCredit : setBuyCredit}
                    setPaymentMethod={mode === "buy" ? setSellPaymentMethod : setBuyPaymentMethod}
                    bulkTotal={buyBulk}
                    setBulk={setBuyBulk}
                    onChange={ (item, attribute, value) => {
                        if (attribute === "quantity") {
                            buyCart.changeProductQuantity(item, value)
                        } else {
                            buyCart.products[item].product.sale_price = Math.round(value * 100)
                        }
                        setChangeCounter(changeCounter + 1)
                        setBuyCards(buyCart.priceTotal())
                }} onDelete={(id) => {
                    buyCart.deleteProduct(id)
                    setBuyCards(buyCart.priceTotal())
                    setChangeCounter(changeCounter + 1)
                }}/>
                <BuyItemAdder bulkBuyer={false} mode="buy" onSubmit={(product) => {
                    buyCart.addProduct(product, false)
                    setLastScan(product)
                    setBuyCards(buyCart.priceTotal())
                    setChangeCounter(changeCounter + 1)
                }}/>
            </div>
    }
    if (mode === "sell" || mode === "trade") {
        maybeSellSide = <div id={mode === "trade" ? "sell-side" : undefined}>
            <BulkSellPanel cart={sellCart} 
                cashPaid={mode === "sell" ? buyCash: sellCash}
                setCashPaid={mode === "sell" ? setBuyCash : setSellCash} 
                creditPaid={mode === "sell" ? buyCredit: sellCredit}
                setCreditPaid={mode === "sell" ? setBuyCredit : setSellCredit}
                setPaymentMethod={mode === "sell" ? setBuyPaymentMethod : setSellPaymentMethod}
                bulkTotal={sellBulk}
                setBulk={setSellBulk}
                onDelete={ (id) => {
                    sellCart.deleteProduct(id)
                    setSellCards(sellCart.priceTotal())
                    setChangeCounter(changeCounter + 1)
                }}
            />
            <BuyItemAdder mode="sell" bulkBuyer={true} onSubmit={ (product) => {
                sellCart.addProduct(product)
                setLastScan(product)
                setSellCards(sellCart.priceTotal())
                setChangeCounter(changeCounter + 1)
            }}/>
        </div>
    }
    if (mode === "bulk") {
        maybeBuySide = <div id={"bulk"}>
            <BulkBuyPanel cart={buyCart} 
                    cashPaid={sellCash}
                    setCashPaid={setSellCash} 
                    creditPaid={sellCredit}
                    setCreditPaid={setSellCredit}
                    setPaymentMethod={setSellPaymentMethod}
                    bulkTotal={buyBulk}
                    setBulk={setBuyBulk}
                    changeBarcode={ (oldBarcode, newBarcode) => buyCart.changeBarcode(oldBarcode, newBarcode)}
                    onDelete={(id) => {
                    buyCart.deleteProduct(id)
                    setBuyCards(buyCart.priceTotal())
                    setChangeCounter(changeCounter + 1)
                }}/>
            <BuyItemAdder mode="buy" bulkBuyer={true} onSubmit={(product) => {
                buyCart.addProduct(product, false)
                setLastScan(product)
                setBuyCards(buyCart.priceTotal())
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
                <PercentageInfo buyCards={buyCards} buyCash={buyCash} buyCredit={buyCredit}
                    sellCards={sellCards} sellCash={sellCash} sellCredit={sellCredit}
                />
                <p className="error-text">
                    {error}
                </p>
                <div id="submit">
                    <WhiteTextButton text="Submit Transaction" onClick={async () => {
                        
                        if (mode === "trade") {
                            let totalSellPrice = sellCards + sellBulk + sellCash + sellCredit

                            // The difference in price between what the customer gave (in money and store credit) 
                            // and what was given to the customer is represented as store credit that was issued 
                            // to the customer and then immediately redeemed.
                            let creditDifference = (totalSellPrice) - (buyCash + buyCredit)

                            buyItems(buyCart, creditDifference, sellCredit + creditDifference, sellPaymentMethod, buyBulk)
                            sellItems(sellCart, totalSellPrice, buyCredit + creditDifference, buyPaymentMethod, sellBulk)
                        } else if (mode === "bulk") {
                            let rates = await getRates()
                            let threshhold = await getThreshhold()

                            // Validate that everything which should have an asset tag does have an asset tag
                            for (let itemID in buyCart.products) {
                                if (itemID[0] === "B" && (getMarketPrice(buyCart.products[itemID].product) ?? 0) > threshhold) {
                                    // something that should have an asset tag, does not
                                    setError(`Assign an asset tag to ${buyCart.products[itemID].product.description}`)
                                    return
                                }
                            }


                            let bulkTotal = 0
                            let payingCash = sellCash !== 0
                            for (let itemID in buyCart.products) {
                                if (itemID[0] === "B") {
                                    let market = getMarketPrice(buyCart.products[itemID].product) ?? 0
                                    let rate = calculateRates(rates, market, "card")[payingCash ? 0 : 1]
                                    bulkTotal += market * rate
                                    delete buyCart.products[itemID]
                                }
                            }
                            buyItems(buyCart, sellCash + sellCredit, sellCredit, sellPaymentMethod, bulkTotal)

                        } else {
                            if (buyCards !== 0 || buyBulk !== 0) {
                                buyItems(buyCart, sellCards + sellCash + sellCredit, sellCredit, sellPaymentMethod, buyBulk)
                            }
                            if (sellCards !== 0 || sellBulk !== 0) {
                                sellItems(sellCart, buyCards + buyCash + buyCredit, buyCredit, buyPaymentMethod, sellBulk)
                            }
                        }

                        clearAll()
                    }}/>
                </div>
                
            </div>
        </div>
    )
}