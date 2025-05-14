import { Product, SlabCert } from "@/types/Product"
import constants from "@/constants.json"
import getCookieValue from "./getCookie"
import { BackendAPIError } from "@/types/BackendAPIError"

export default async function getProductInfo (productID: string): Promise<Product | SlabCert | BackendAPIError> {

    let urlParams = new URLSearchParams(
        {
            "id": productID
        }
    )
    // Fetch data from back-end server
    let response = await fetch(`${constants.BACKEND_URL}/v1/inventory?${urlParams}`,
        {
            headers: new Headers({
                "Authorization": getCookieValue("token")
            })
        }
    )
    let json = await response.json()
    
    if ("error" in json && (productID.length === 8 || productID.length === 9)) {
        // This is a PSA slab
        json = await fetch(`${constants.BACKEND_URL}/v1/psa?${urlParams}`, {
            headers: new Headers({
            "Authorization": getCookieValue("token")
        })}).then( (response) => response.json())
    }
    let returnValue = new Promise<Product | SlabCert | BackendAPIError>( (resolve, reject) => {resolve(json)})
    return returnValue
}