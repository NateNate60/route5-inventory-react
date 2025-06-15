import constants from "@/constants.json"
import getCookieValue from "./getCookie"
import { TokenValidityRecord } from "@/types/TokenValidityRecord"

export function login (username: string, password: string, staySignedIn: boolean = false) {
    return fetch(`${constants["BACKEND_URL"]}/v1/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            stay_in: staySignedIn
        })
    }).then(
        (response) => response.json()
    ).then( (json) => {
        if ("error" in json) {
            return false
        }
        document.cookie = `token=Bearer ${json["access_token"]}; Max-Age=${10 * 60}; path=/`
        document.cookie = `refresh_token=Bearer ${json["refresh_token"]}; Max-Age=${staySignedIn ? 30 * 24 * 60 * 60 : 24 * 60 * 60}; path=/`
        return true
    })
}

export function logout () {
    document.cookie = `token=; Max-Age=0; path=/`
    document.cookie = `refresh_token=; Max-Age=0; path=/`
}

export async function refreshToken () {
    let token = getCookieValue("refresh_token")
    if (!token) {
        // Logged out, no refresh token!
        return
    }
    let json = await fetch(`${constants["BACKEND_URL"]}/v1/login/tokens/access`, {
        headers: {
            "Authorization": token
        }
    }).then( (response) => response.json()
    )
    document.cookie = `token=Bearer ${json["access_token"]}; Max-Age=${10 * 60}; path=/`
}

export async function checkAccessValidity (): Promise<TokenValidityRecord> {
    await refreshToken()
    let token = getCookieValue("token")
    let response = await fetch(`${constants.BACKEND_URL}/v1/login/tokens/access/validity`, {
        headers: {
            "Authorization": token
        }
    }).then( (response) => response.json())
    return {
        expiration: response["expiration"],
        username: response["username"]
    }
}