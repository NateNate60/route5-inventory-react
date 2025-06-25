export type Product = {
    id: string,
    type: "card" | "slab" | "sealed",
    description: string,
    condition: string,
    acquired_price: number,
    acquired_date: string,
    sale_price: number,
    tcg_price_data?: TCGProductData,
    quantity: number,
    consignor_name: string,
    consignor_contact: string,
    sale_price_date: string,
    sale_date: string
}

export type SlabCert = {
    cert: string,
    name: string,
    grade: string,
    grader: string
}

export type ProductQuantity = {
    product: Product,
    quantity: number
}

export type TCGProductData = {
    tcgID: string,
    canonicalName: string,
    setName: string,
    attribute: string,
    number?: string,
    priceData: TCGCardData | TCGSealedData
}

export type TCGCardData = {
    nmMarketPrice: number,
    lpMarketPrice: number,
    mpMarketPrice: number,
    hpMarketPrice: number,
    dmMarketPrice: number
}

export type TCGSealedData = {
    sealedMarketPrice: number,
    sealedLowPrice: number
}