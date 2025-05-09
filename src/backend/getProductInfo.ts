import { Product } from "@/types/Product"
import constants from "@/constants.json"
import getCookieValue from "./getCookie"

export default async function getProductInfo (productID: string): Promise<Product> {

    let urlParams = new URLSearchParams(
        {
            "id": productID
        }
    )
    // Fetch data from back-end server
    return fetch(`${constants.BACKEND_URL}/v1/inventory?${urlParams}`,
        {
            headers: new Headers({
                "Authorization": getCookieValue("token")
            })
        }
    ).then( (response) => response.json())
}