import { getMarketPrice } from "@/backend/searchProducts"
import { Product, ProductQuantity } from "./Product"

export class ProductQuantityList {
    products: {
        [id: string]: ProductQuantity
    }

    bulkCount = 0

    constructor() {
        this.products = {}
    }

    changeProductQuantity (productID: string, quantity: number) {
        /*
        Change the quantity of a product, if it exists.
        */
        if (productID in this.products) {
            this.products[productID].quantity = quantity
        }
    }

    deleteProduct (productID: string) {
        /*
        Remove the product with the given ID from the list
        */
        if (productID in this.products) {
            delete this.products[productID]
        }
    }

    changeBarcode (oldBarcode: string, newBarcode: string): boolean {
        /*
        Change the barcoode of an item from oldBarcode to newBarcode
        */
        if (oldBarcode !== newBarcode) {
            if (newBarcode in this.products) {
                return false
            }
            this.products[oldBarcode].product.id = newBarcode
            let props = Object.getOwnPropertyDescriptor(this.products, oldBarcode)
            if (props !== undefined){
                Object.defineProperty(this.products, newBarcode, props)
                delete this.products[oldBarcode]
                return true
            }
        }
        return false
    }

    priceTotal (useAcquirePrice: boolean = false): number {
        /*
        Return the total sale price of all items in the list
        */
        let price: number = 0
        for (let item in this.products) {
            if (useAcquirePrice) {
                price += this.products[item].product.acquired_price * this.products[item].quantity
            } else {
                price += this.products[item].product.sale_price * this.products[item].quantity
            }
        }
        return price
    }

    addProduct (product: Product, enforceQuantityConstraint: boolean = true): boolean {
        /*
        Add a product to the list
        */
        if (product.id === "BULK") {
            // This item was added using the Bulk Buyer
            this.bulkCount++
            product.id = "B" + this.bulkCount
            product.sale_price = getMarketPrice(product) ?? NaN
            this.products[product.id] = {
                product: product,
                quantity: 1
            }

        } else if (product.id in this.products) {
            if (enforceQuantityConstraint && this.products[product.id].quantity >= this.products[product.id].product.quantity) {
                // The product is out of stock
                return false
            }
            this.products[product.id].quantity++
        } else {
            if (enforceQuantityConstraint && product.quantity === 0) {
                // There is no stock of the product
                return false
            }
            this.products[product.id] = {
                product: product,
                quantity: 1
            }
        }
        return true
    }
}