import constants from "@/constants.json"
import getCookieValue from "./getCookie"
import { BackendAPIError } from "@/types/BackendAPIError"

export default async function uploadPricingData (file: File): Promise<number | BackendAPIError> {
    let formData = new FormData()
    formData.append("file", file)
    return fetch(`${constants.BACKEND_URL}/v1/prices/update`, {
        method: "POST",
        headers: {
            "Authorization": getCookieValue("token")
        },
        body: formData
    }).then( (response) => response.json()
    ).then( (json) => {
        if ("error" in json) {
            return json
        } else {
            return json["updated_records"]
        }
    })
}