import { Rates } from "@/types/Rates"

export default function calculateRates (rates: Rates, marketPrice: number, type: "card" | "slab" | "sealed"): [number, number] {
    /*
    Calculate the cash and credit rates for a card of the given Market Price
    */


    let cashRate = NaN
    let creditRate = NaN
    let tier = 0
    if (rates !== undefined && marketPrice !== undefined) {
        for (let i of rates.cutoffs[type]) {
            if (marketPrice > i) {
                tier++
            }
        }
        creditRate = rates.creditRates.card[tier]
        cashRate = rates.cashRates.card[tier]
    }
    return [cashRate, creditRate]
}