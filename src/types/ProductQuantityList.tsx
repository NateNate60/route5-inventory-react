import { Product } from "./Product"

export class ProductQuantityList {
    products: {
        [id: string]: {
            product: Product,
            inCart: number
        }
    }

    constructor() {
        this.products = {}
    }

    changeProductQuantity (productID: string, inCart: number) {
        /*
        Change the quantity of a product, if it exists.
        */
        if (productID in this.products) {
            this.products[productID].inCart = inCart
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

    priceTotal (): number {
        /*
        Return the total sale price of all items in the list
        */
        let price: number = 0
        for (let item in this.products) {
            price += this.products[item].product.sale_price * this.products[item].inCart
        }
        return price
    }

    addProduct (product: Product): boolean {
        /*
        Add a product to the list
        */
        if (product.id in this.products) {
            if (this.products[product.id].inCart >= this.products[product.id].product.quantity) {
                // The product is out of stock
                return false
            }
            this.products[product.id].inCart++
        } else {
            this.products[product.id] = {
                product: product,
                inCart: 1
            }
        }
        return true
    }
}