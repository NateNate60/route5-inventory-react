import constants from "@/constants.json"
import getCookieValue from "./getCookie"
import { User } from "@/types/User"

export default async function getUsers (): Promise<Array<User>> {
    return fetch(`${constants.BACKEND_URL}/v1/users`, {
        headers: {
            "Authorization": getCookieValue("token")
        }
    }
    ).then( (response) => response.json()
    ).then( (json) => {
        let users: Array<User> = []
        for (let user of json) {
            users.push({
                username: user["username"],
                isAdmin: String(user["roles"]).includes("admin"),
                dateCreated: new Date(user["created"]),
                lastLogin: new Date(user["last_logged_in"])
            })
        }
        return users
    })
}