import { Product } from "@/types/Product";

interface SingleProductDisplayerProps {
    product?: Product,
    editable: boolean
}

export default function SingleProductDisplayer ({product, editable}: SingleProductDisplayerProps) {
    let offset = new Date().getTimezoneOffset()
    if (product === undefined) {
        return (
            <></>
        )
    }
    return (
        <table>
            <thead>
                <tr>
                    <th className="single-product-displayer">
                        Item Name
                    </th>
                    <td colSpan={3} className="single-product-displayer">
                        {product.description}
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th className="single-product-displayer">
                        Condition
                    </th>
                    <td className="single-product-displayer">
                        {product.condition}
                    </td>
                    <th className="single-product-displayer">
                        Quantity In Stock
                    </th>
                    <td className="single-product-displayer">
                        {product.quantity}
                    </td>
                </tr>
                <tr>
                    <th className="single-product-displayer">
                        Acquired Price
                    </th>
                    <td className="single-product-displayer">
                        ${Math.round(product.acquired_price) / 100}
                    </td>
                    <th className="single-product-displayer">
                        Acquired Date
                    </th>
                    <td className="single-product-displayer">
                        {new Date(new Date(product.acquired_date).getTime() + offset * 60 * 1000).toISOString().slice(0, 10)}
                    </td>
                </tr>
                <tr>
                    <th className="single-product-displayer">
                        Sale Price
                    </th>
                    <td className="single-product-displayer">
                        ${Math.round(product.sale_price) / 100}
                    </td>
                    <th className="single-product-displayer">
                        Sale Date
                    </th>
                    <td className="single-product-displayer">
                        {product.sale_date === "" ? "" : new Date(new Date(product.sale_date).getTime() + offset * 60 * 1000).toISOString().slice(0, 10)}
                    </td>
                </tr>
                <tr>
                    <th className="single-product-displayer">
                        Consignor
                    </th>
                    <td colSpan={3} className="single-product-displayer">
                        {product.consignor_name}
                        <br/>
                        {product.consignor_contact}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}