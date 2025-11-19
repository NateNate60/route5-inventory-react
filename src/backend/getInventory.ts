import CONSTANTS from "@/constants.json";
import getCookieValue from "./getCookie";
import { Product } from "@/types/Product";
import { BackendAPIError } from "@/types/BackendAPIError";

const CACHED_INVENTORY_VALIDITY_SECONDS = 180

export default async function getInventory (): Promise<Array<Product> | BackendAPIError> {
    let storedData = localStorage.getItem("inventory")
    if (storedData !== null) {
        let parsedData = JSON.parse(storedData)
        if (Date.now() - parsedData.timestamp < CACHED_INVENTORY_VALIDITY_SECONDS * 1000) {
            return new Promise<Array<Product>>( (resolve, reject) => 
                resolve(parsedData["inventory"]))
        }
    }
    let r = await fetch(`${CONSTANTS.BACKEND_URL}/v1/inventory/all`,
            {
                headers: {
                    "Authorization": getCookieValue("token")
                }
            }
        )
    let data = r.json()
    data.then((data) => {
        if ("error" in data) {
            return
        }
        localStorage.setItem("inventory", JSON.stringify({timestamp: Date.now(), inventory: data}))
    })
    return data
}