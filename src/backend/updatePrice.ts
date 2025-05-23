import constants from "@/constants.json"
import getCookieValue from "./getCookie"

export default function updatePrice (newPrice: number, itemID: string) {
    fetch(`${constants.BACKEND_URL}/v1/inventory/prices?id=${itemID}&price=${newPrice}`, {
        method: "PATCH",
        headers: {
            "Authorization": getCookieValue("token")
        }
    })
}