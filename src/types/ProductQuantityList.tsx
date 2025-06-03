import { Product, ProductQuantity } from "./Product"

export class ProductQuantityList {
    products: {
        [id: string]: ProductQuantity
    }

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
        if (product.id in this.products) {
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