import { Product, ProductQuantity } from "./Product"

export type BuyTransaction = {
    txid: string,
    acquired_date: string,
    acquired_from_name: string,
    acquired_from_contact: string,
    acquired_price_total: number,
    payment_method: string,
    bulk_total: number,
    credit_given: number,
    items: Array<TransactionProductInfo>
}

export type SaleTransaction = {
    sale_date: string,
    sale_price_total: number,
    payment_method: string,
    credit_applied: number,
    bulk_total: number,
    txid: string,
    items: Array<TransactionProductInfo>
}

export type TransactionProductInfo = {
    id: string,
    sale_price: number,
    acquired_price: number | null,
    quantity: number,
    description: string
}