import { ProductQuantityList } from "@/types/ProductQuantityList";
import getCookieValue from "./getCookie";
import CONSTANTS from "@/constants.json"
import { Product } from "@/types/Product";

export default async function buyItems (cart: ProductQuantityList,
                                        moneyGiven: number,
                                        creditGiven: number,
                                        paymentMethod: string,
                                        sellerName: string = "",
                                        sellerContact: string = ""): Promise<any> {
    let cookie = getCookieValue("token")
    let items: Array<Product> = []

    let percentage = (moneyGiven + creditGiven) / cart.priceTotal()

    for (let itemID in cart.products) {
        cart.products[itemID].product.quantity = cart.products[itemID].quantity
        let target = cart.products[itemID].product
        target.acquired_price = target.sale_price * percentage
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