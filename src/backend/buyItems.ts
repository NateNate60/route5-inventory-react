import { ProductQuantityList } from "@/types/ProductQuantityList";
import getCookieValue from "./getCookie";
import CONSTANTS from "@/constants.json"
import { Product } from "@/types/Product";

export default async function buyItems (products: ProductQuantityList,
                                        sellerName: string,
                                        sellerContact: string): Promise<any> {
    let cookie = getCookieValue("token")
    let items: Array<Product> = []

    for (let itemID in products.products) {
        products.products[itemID].product.quantity = products.products[itemID].inCart
        items.push(products.products[itemID].product)
    }


    let response = await fetch(`${CONSTANTS.BACKEND_URL}/v1/inventory/add`, {
        method: "POST",
        headers: {
            "Authorization": cookie,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: items,
            acquired_from_name: sellerName,
            acquired_from_contact: sellerContact
        })
    })

    return response.json()
}