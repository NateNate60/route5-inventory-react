import { ProductQuantity } from "./Product"

export class ProductQuantityList {
    products: Array<ProductQuantity>

    constructor(products: Array<ProductQuantity> = []) {
        this.products = products
    }

    changeProductQuantity (productID: string, quantity: number) {
        /*
        Change the quantity of a product.
        */
        this.products.forEach( (item: ProductQuantity) => {
            if (item.product.id === productID) {
                item.quantity = quantity
            }
        })
    }

    deleteProduct (productID: string) {
        /*
        Remove the product with the given ID from the list
        */
        let newArray = this.products.filter( (item: ProductQuantity) => item.product.id !== productID)
        this.products = newArray
    }

    priceTotal (): number {
        /*
        Return the total sale price of all items in the list
        */
        let price: number = 0
        for (let item of this.products) {
            price += item.product.sale_price * item.quantity
        }
        return price
    }
}