export type Product = {
    id: string,
    type: "card" | "slab" | "sealed",
    description: string,
    condition: string,
    acquired_price: number,
    sale_price: number,
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