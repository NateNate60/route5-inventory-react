import constants from "@/constants.json"
import getCookieValue from "./getCookie"

export default async function addUser (username: string, password: string, isAdmin: boolean): Promise<string> {
    return await fetch(`${constants.BACKEND_URL}/v1/users/add`, {
        method: "POST",
        headers: {
            "Authorization": getCookieValue("token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            roles: isAdmin ? "admin" : ""
        })
    }).then( (response) => response.json()
    ).then( (json) => {
        if ("error" in json) {
            return json["error"]
        } else {
            return ""
        }
    })
}