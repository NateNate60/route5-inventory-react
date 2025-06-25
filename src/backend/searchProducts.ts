import { Product, TCGProductData } from "@/types/Product";
import constants from "@/constants.json";
import getCookieValue from "./getCookie";


export default async function searchProducts (productName: string, productType: "sealed" | "card" | "slab"): Promise<Array<TCGProductData>> {
    let params = new URLSearchParams()
    if (productName.length === 12 && productType === "sealed") {
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
                    attribute: "",
                    priceData: {
                        nmMarketPrice: result["nm_market_price"],
                        lpMarketPrice: result["lp_market_price"],
                        mpMarketPrice: result["mp_market_price"],
                        hpMarketPrice: result["hp_market_price"],
                        dmMarketPrice: result["dm_market_price"]
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
    */
    let marketPrice = 0
    let priceData = product.tcg_price_data?.priceData
    if (priceData === undefined) {
        return undefined
    }
    if ("nmMarketPrice" in priceData) {

        switch (product.condition) {
            case "NM":
                marketPrice = priceData.nmMarketPrice
                break
            case "LP":
                marketPrice = priceData.lpMarketPrice
                break
            case "MP":
                marketPrice = priceData.mpMarketPrice
                break
            case "HP":
                marketPrice = priceData.hpMarketPrice
                break
            case "DM":
                marketPrice = priceData.dmMarketPrice
                break
        }
    } else if ("sealedMarketPrice" in priceData) {
        marketPrice = priceData.sealedLowPrice
    }
    return marketPrice
}