import { Rates } from "@/types/Rates";
import CONSTANTS from "@/constants.json"
import getCookieValue from "./getCookie";

export async function getRates (): Promise<Rates> {
    return fetch(`${CONSTANTS.BACKEND_URL}/v1/settings/rates`, {
        headers: {
            "Authorization": getCookieValue("token")
        }
    }).then( (response) => response.json()
    ).then((json) => {return {
        cutoffs: json["cutoffs"],
        cashRates: json["cash_rates"],
        creditRates: json["credit_rates"]
    }})
}

export async function getThreshhold (): Promise<number> {
    return fetch(`${CONSTANTS.BACKEND_URL}/v1/settings/threshhold`, {
        headers: {
            "Authorization": getCookieValue("token")
        }
    }).then( (response) => response.json()
    ).then((json) => json["value"])
}