import CONSTANTS from "@/constants.json";
import getCookieValue from "./getCookie";
import { Product } from "@/types/Product";
import { BackendAPIError } from "@/types/BackendAPIError";

export default async function getInventory (): Promise<Array<Product> | BackendAPIError> {
    let r = await fetch(`${CONSTANTS.BACKEND_URL}/v1/inventory/all`,
        {
            headers: {
                "Authorization": getCookieValue("token")
            }
        }
    )

    return r.json()
}