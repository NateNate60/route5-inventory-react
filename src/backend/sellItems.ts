import { ProductQuantityList } from "@/types/ProductQuantityList";
import getCookieValue from "./getCookie";
import CONSTANTS from "@/constants.json"

export default async function sellItems (items: ProductQuantityList, priceTotal: number, creditApplied: number, paymentMethod: string) {
    let percentage = priceTotal / items.priceTotal()
    let cookie = getCookieValue("token")

    let data = {
        items: Array<any>(),
        credit_applied: creditApplied,
        payment_method: paymentMethod
    }
    for (let item in items.products) {
        data.items.push({
            id: item,
            sale_price: Math.round(percentage * items.products[item].product.sale_price),
            quantity: items.products[item].quantity
        })
    }

    return fetch(`${CONSTANTS.BACKEND_URL}/v1/inventory/remove`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": cookie,
            "Content-Type": "application/json"
        }
    }).then( (response) => response.json()
    )
}