import constants from "@/constants.json"
import getCookieValue from "./getCookie"

export default async function associateUPC (tcgID: string, upc: string): Promise<string> {
    let params = new URLSearchParams()
    params.append("tcg_id", tcgID)
    params.append("upc", upc)
    return fetch(`${constants.BACKEND_URL}/v1/prices/associateupc?${params.toString()}`, {
        method: "PUT",
        headers: {
            "Authorization": getCookieValue("token")
        }
    }).then( (response) => response.json()
    ).then( (json) => {
        if ("error" in json) {
            let r: string = json["error"]
            return r
        }
        return ""
    })
}