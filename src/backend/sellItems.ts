import { ProductQuantityList } from "@/types/ProductQuantityList";
import getCookieValue from "./getCookie";
import CONSTANTS from "@/constants.json"

export default async function sellItems (cart: ProductQuantityList,
                                         moneyReceived: number,
                                         creditReceived: number, 
                                         paymentMethod: string,
                                         ) {
    let percentage = (moneyReceived + creditReceived) / cart.priceTotal()
    let cookie = getCookieValue("token")

    let data = {
        items: Array<any>(),
        credit_applied: creditReceived,
        payment_method: paymentMethod
    }
    for (let item in cart.products) {
        data.items.push({
            id: item,
            description: cart.products[item].product.description,
            sale_price: Math.round(percentage * cart.products[item].product.sale_price),
            quantity: cart.products[item].quantity
        })
    }

    return fetch(`${CONSTANTS.BACKEND_URL}/v1/inventory/sell`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": cookie,
            "Content-Type": "application/json"
        }
    }).then( (response) => response.json()
    )
}