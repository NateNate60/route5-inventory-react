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

export default function UnifiedBuySellPage () {
    const [changeCounter, setChangeCounter] = useState<number>(0)

    const [buyCart, setBuyCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [buyCards, setBuyCards] = useState<number>(0)
    const [buyCredit, setBuyCredit] = useState<number>(0)
    const [buyCash, setBuyCash] = useState<number>(0)
    const [buyPaymentMethod, setBuyPaymentMethod] = useState<string>("cash")

    const [lastScan, setLastScan] = useState<Product>()
    
    const [sellCart, setSellCart] = useState<ProductQuantityList>(new ProductQuantityList())
    const [sellCards, setSellCards] = useState<number>(0)
    const [sellCredit, setSellCredit] = useState<number>(0)
    const [sellCash, setSellCash] = useState<number>(0)
    const [sellPaymentMethod, setSellPaymentMethod] = useState<string>("cash")

    useEffect( () => {
        refreshToken()
        const interval = setInterval( () => {
            refreshToken()
        }, 60000)
        return () => clearInterval(interval);
    })

    return (
        <div>
            <BackButton/>
            <h1 id="page-title">Record New Transaction</h1>
            <div id="panels">
                <div id="buy-side">
                    <BuyPanel cart={buyCart} setCashPaid={setBuyCash} setCreditPaid={setBuyCredit} setPaymentMethod={setBuyPaymentMethod}
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
                    <BuyItemAdder onSubmit={(product) => {
                        buyCart.addProduct(product, false)
                        setLastScan(product)
                        setBuyCards(buyCart.priceTotal())
                        setChangeCounter(changeCounter + 1)
                    }}/>
                </div>
                <div id="sell-side">
                    <SellPanel cart={sellCart} setCashPaid={setSellCash} setCreditPaid={setSellCredit} setPaymentMethod={setSellPaymentMethod}
                        onChange={ (item, quantity) => {
                            sellCart.products[item].quantity = quantity
                            setSellCards(sellCart.priceTotal())
                            setChangeCounter(changeCounter + 1)
                    }} onDelete={ (id) => {
                        sellCart.deleteProduct(id)
                        setSellCards(sellCart.priceTotal())
                        setChangeCounter(changeCounter + 1)
                    }}/>
                    <SellItemAdder onSubmit={ (product) => {
                        sellCart.addProduct(product)
                        setLastScan(product)
                        setSellCards(sellCart.priceTotal())
                        setChangeCounter(changeCounter + 1)
                    }}/>
                </div>
            </div>
            <div id="summary">
                <h3>Last Scanned Item</h3>
                <SingleProductDisplayer product={lastScan} editable={false}/>
                <hr/>
                <PercentageInfo buyCards={buyCards} buyCash={buyCash} buyCredit={buyCredit}
                    sellCards={sellCards} sellCash={sellCash} sellCredit={sellCredit}
                />
                <div id="submit">
                    <WhiteTextButton text="Submit Transaction" onClick={() => {
                        if (buyCards !== 0) {
                            buyItems(buyCart, sellCards + sellCash + sellCredit, sellCredit, sellPaymentMethod)
                        }
                        if (sellCards !== 0) {
                            sellItems(sellCart, buyCards + buyCash + buyCredit, buyCredit, buyPaymentMethod)
                        }

                        setBuyCart(new ProductQuantityList())
                        setBuyCards(0)
                        setBuyCash(0)
                        setBuyCredit(0)
                        setBuyPaymentMethod("cash")

                        setSellCart(new ProductQuantityList())
                        setSellCards(0)
                        setSellCash(0)
                        setSellCredit(0)
                        setSellPaymentMethod("cash")
                    }}/>
                </div>
                
            </div>
        </div>
    )
}