import { Product, TCGProductData } from "@/types/Product";
import constants from "@/constants.json";
import getCookieValue from "./getCookie";


export default async function searchProducts (productName: string, productType: "sealed" | "card" | "slab"): Promise<Array<TCGProductData>> {
    let params = new URLSearchParams()
    if (productName.match(/^((\d{12})|(^[^1]\d{12}))$/) && productType === "sealed") {
        params.append("upc", productName)
    }
    params.append("query", productName)
    params.append("type", productType)
    return fetch(`${constants.BACKEND_URL}/v1/prices/search?${params.toString()}`, {
        headers: {
            "Authorization": getCookieValue("token")
        }
    }).then( (response) => response.json()
    ).then( (json) => {
        let r: Array<TCGProductData> = []
        for (let result of json) {
            if ("upc" in result) {
                // this is sealed
                r.push({
                    tcgID: result["tcg_id"],
                    canonicalName: result["item_name"],
                    setName: result["set_name"],
                    attribute: "",
                    number: result["upc"],
                    priceData: {
                        sealedLowPrice: result["sealed_low_price"],
                        sealedMarketPrice: result["sealed_market_price"]
                    }
                })
            } else if ("card_name" in result) {
                // This is a Pokemon single
                r.push({
                    tcgID: result["tcg_id"],
                    canonicalName: result["card_name"],
                    setName: result["set_name"],
                    attribute: result["attribute"],
                    number: result["card_number"],
                    priceData: {
                        nmMarketPrice: result["nm_market_price"],
                        lpMarketPrice: result["lp_market_price"],
                        mpMarketPrice: result["mp_market_price"],
                        hpMarketPrice: result["hp_market_price"],
                        dmMarketPrice: result["dm_market_price"],
                        nmLowPrice: result["nm_low_price"],
                        lpLowPrice: result["lp_low_price"],
                        mpLowPrice: result["mp_low_price"],
                        hpLowPrice: result["hp_low_price"],
                        dmLowPrice: result["dm_low_price"],
                        
                    }
                })
            }
        }
        return r
    })
}

export function getMarketPrice (product: Product): number | undefined {
    /*
    Return the market price of a product for its appropriate condition

    If the market price is higher than the other conditions, return the market price of
    the higher conditions instead.
    */
    let marketPrice = Infinity
    let priceData = product.tcg_price_data?.priceData
    if (priceData === undefined) {
        return undefined
    }
    if ("nmMarketPrice" in priceData) {
        switch (product.condition) {
            case "DM":
                marketPrice = priceData.dmMarketPrice
            case "HP":
                if (priceData.hpMarketPrice < marketPrice) {
                    marketPrice = priceData.hpMarketPrice
                }
            case "MP":
                if (priceData.mpMarketPrice < marketPrice) {
                    marketPrice = priceData.mpMarketPrice
                }
            case "LP":
                if (priceData.lpMarketPrice < marketPrice) {
                    marketPrice = priceData.lpMarketPrice
                }
            case "NM":
                if (priceData.nmMarketPrice < marketPrice) {
                    marketPrice = priceData.nmMarketPrice
                }

        }
    } else if ("sealedMarketPrice" in priceData) {
        marketPrice = priceData.sealedLowPrice
    }
    return marketPrice
}

export function getLowPrice (product: Product): number | undefined {
    /*
    Return the TCG Low price of a product for its appropriate condition

    If the price is higher than the other conditions, return the market price of
    the higher conditions instead.
    */
    let LowPrice = Infinity
    let priceData = product.tcg_price_data?.priceData
    if (priceData === undefined) {
        return undefined
    }
    if ("nmMarketPrice" in priceData) {
        switch (product.condition) {
            case "DM":
                LowPrice = priceData.dmLowPrice
            case "HP":
                if (priceData.hpLowPrice < LowPrice) {
                    LowPrice = priceData.hpLowPrice
                }
            case "MP":
                if (priceData.mpLowPrice < LowPrice) {
                    LowPrice = priceData.mpLowPrice
                }
            case "LP":
                if (priceData.lpLowPrice < LowPrice) {
                    LowPrice = priceData.lpLowPrice
                }
            case "NM":
                if (priceData.nmLowPrice < LowPrice) {
                    LowPrice = priceData.nmLowPrice
                }

        }
    } else if ("sealedMarketPrice" in priceData) {
        LowPrice = priceData.sealedLowPrice
    }
    return LowPrice
}