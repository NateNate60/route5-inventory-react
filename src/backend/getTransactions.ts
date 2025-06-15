import constants from "@/constants.json"
import {BuyTransaction, SaleTransaction} from "@/types/Transaction"
import getCookieValue from "./getCookie"
import getProductInfo from "./getProductInfo"

export async function getBuyTransactions (startDate?: Date, endDate?: Date): Promise<Array<BuyTransaction>> {
    let params = new URLSearchParams()
    params.append("start_date", startDate?.toISOString() ?? "1980-01-01T00:00:00.000Z")
    params.append("end_date", endDate?.toISOString() ?? "9999-01-01T00:00:00.000Z")
    let response = await fetch(`${constants.BACKEND_URL}/v1/transaction/buys?${params}`, {
        headers: {
            "Authorization": getCookieValue("token")
        }
    })
    return response.json().then(
        async (json) => {
            let r: Array<BuyTransaction> = []
            if ("error" in json) {
                return r
            }
            for (let tx of json) {
                let transaction: BuyTransaction = {
                    txid: tx["txid"],
                    acquired_date: tx["acquired_date"],
                    acquired_price_total: tx["acquired_price_total"],
                    acquired_from_name: tx["acquired_from_name"],
                    acquired_from_contact: tx["acquired_from_contact"],
                    payment_method: tx["payment_method"],
                    credit_given: tx["credit_given"],
                    items: []
                }
                for (let item of tx["items"]) {
                    transaction.items.push({
                        id: item["id"],
                        sale_price: item["sale_price"],
                        acquired_price: item["acquired_price"],
                        quantity: item["quantity"],
                        description: item["description"]
                    })
                }
                r.push(transaction)
            }
            return r
        }
    )
}

export async function getSellTransactions (startDate?: Date, endDate?: Date): Promise<Array<SaleTransaction>> {
    let params = new URLSearchParams()
    params.append("start_date", startDate?.toISOString() ?? "1980-01-01T00:00:00.000Z")
    params.append("end_date", endDate?.toISOString() ?? "9999-01-01T00:00:00.000Z")
    let response = await fetch(`${constants.BACKEND_URL}/v1/transaction/sales?${params}`, {
        headers: {
            "Authorization": getCookieValue("token")
        }
    })
    return response.json().then(
        async (json) => {
            let r: Array<SaleTransaction> = []
            if ("error" in json) {
                return r
            }
            for (let tx of json) {
                let transaction: SaleTransaction = {
                    txid: tx["txid"],
                    sale_date: tx["sale_date"],
                    sale_price_total: tx["sale_price_total"],
                    payment_method: tx["payment_method"],
                    credit_applied: tx["credit_applied"],
                    items: []
                }
                for (let item of tx["items"]) {
                    transaction.items.push({
                        quantity: item["quantity"],
                        id: item["id"],
                        sale_price: item["sale_price"],
                        acquired_price: item["acquired_price"],
                        description: item["description"]
                    })
                }
                r.push(transaction)
            }
            return r
        }
    )
}