import { Rates } from "@/types/Rates";
import constants from "@/constants.json"
import getCookieValue from "./getCookie";

export default async function updateRates (newRates: Rates) {
    /*
    Update the buy rate table with new rates.
    */

    return fetch(`${constants.BACKEND_URL}/v1/settings/rates`, {
        method: "PATCH",
        body: JSON.stringify({
            "cutoffs": newRates.cutoffs,
            "cash_rates": newRates.cashRates,
            "credit_rates": newRates.creditRates
        }),
        headers: {
            "Authorization": getCookieValue("token"),
            "Content-Type": "application/json"
        }
    })
}