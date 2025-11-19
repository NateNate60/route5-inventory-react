import { ProductQuantityList } from "@/types/ProductQuantityList";
import getCookieValue from "./getCookie";
import CONSTANTS from "@/constants.json"
import { Product } from "@/types/Product";
import { getLowPrice, getMarketPrice } from "./searchProducts";

export default async function buyItems (cart: ProductQuantityList,
                                        moneyGiven: number,
                                        creditGiven: number,
                                        paymentMethod: string,
                                        threshhold: number,
                                        sellerName: string = "",
                                        sellerContact: string = ""): Promise<any> {
    let cookie = getCookieValue("token")
    let items: Array<Product> = []

    let totalCashOfferPrice = 0
    let totalCreditOfferPrice = 0
    let excessPaid = 0

    for (let itemID in cart.products) {
        let marketPrice = getMarketPrice(cart.products[itemID].product)
        let lowPrice = getLowPrice(cart.products[itemID].product)
        if (marketPrice !== undefined && lowPrice !== undefined) {
            let effectivePrice = marketPrice < threshhold && lowPrice < marketPrice ? lowPrice : marketPrice
            totalCashOfferPrice += Math.floor(cart.products[itemID].cashRate * effectivePrice / 50) * 50 * cart.products[itemID].quantity
            totalCreditOfferPrice += Math.floor(cart.products[itemID].creditRate * effectivePrice / 50) * 50 * cart.products[itemID].quantity
        }
    }
    
    if (creditGiven > 0) {
        excessPaid = (moneyGiven + creditGiven) - totalCreditOfferPrice
    } else {
        excessPaid = (moneyGiven + creditGiven) - totalCashOfferPrice
    }

    for (let itemID in cart.products) {
        cart.products[itemID].product.quantity = cart.products[itemID].quantity
        let target = cart.products[itemID].product
        
        // acquired price calculation
        let marketPrice = getMarketPrice(cart.products[itemID].product)
        let lowPrice = getLowPrice(cart.products[itemID].product)
        if (marketPrice !== undefined && lowPrice !== undefined) {
            let effectivePrice = marketPrice < threshhold && lowPrice < marketPrice ? lowPrice : marketPrice
            if (creditGiven > 0) {
                let baseAmountPaid = Math.floor(cart.products[itemID].creditRate * effectivePrice / 50) * 50
                let proportionOfTotal = (baseAmountPaid * cart.products[itemID].quantity) / totalCreditOfferPrice
                let extraAmountPaid = proportionOfTotal * excessPaid / cart.products[itemID].quantity
                target.acquired_price = baseAmountPaid + extraAmountPaid
            } else {
                let baseAmountPaid = Math.floor(cart.products[itemID].cashRate * effectivePrice / 50) * 50
                let proportionOfTotal = (baseAmountPaid * cart.products[itemID].quantity) / totalCashOfferPrice
                let extraAmountPaid = proportionOfTotal * excessPaid / cart.products[itemID].quantity
                target.acquired_price = baseAmountPaid + extraAmountPaid
            }
            
        }
        

        items.push(target)
    }

    let response = await fetch(`${CONSTANTS.BACKEND_URL}/v1/inventory/add`, {
        method: "POST",
        headers: {
            "Authorization": cookie,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: items,
            credit_given: creditGiven,
            payment_method: paymentMethod,
            acquired_from_name: sellerName,
            acquired_from_contact: sellerContact
        })
    })

    return response.json()
}