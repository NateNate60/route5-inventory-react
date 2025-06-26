import constants from "@/constants.json"
import getCookieValue from "./getCookie"

export default async function deleteUser (username: string): Promise<string> {
    let params = new URLSearchParams()
    params.append("username", username)
    return fetch(`${constants.BACKEND_URL}/v1/users/rm?${params.toString()}`, {
        method: "DELETE",
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