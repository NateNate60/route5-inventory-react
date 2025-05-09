import { Product } from "@/types/Product";
import WhiteTextButton from "./buttons/whitebutton";
import { useState } from "react";

interface ProductInforFormProps {
    onSubmit: (product: Product) => any
}

export default function ProductInfoForm ({onSubmit}: ProductInforFormProps) {
    const [barcode, setBarcode] = useState<string>("")
    const [type, setType] = useState<"card" | "slab" | "sealed">("sealed")
    const [description, setDescription] = useState<string>("")
    const [condition, setCondition] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)
    const [acquiredPrice, setAcquiredPrice] = useState<number>(0)
    const [salePrice, setSalePrice] = useState<number>(0)
    const [consignorName, setConsignorName] = useState<string>("")
    const [consignorContact, setConsignorContact] = useState<string>("")
    return (
        <form id="productInfoForm">
            <table width={"80%"}>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label>Product bar code/serial number/asset tag</label>
                        </td>
                        <td>
                            <input type="text" id="barcode" name="barcode" onChange={(e) => setBarcode(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Type</label>
                        </td>
                        <td>
                            <select name="type" id="type" onChange={(e) => {
                                if (e.target.value === "sealed") {
                                    setType("sealed")
                                } else if (e.target.value === "slab") {
                                    setType("slab")
                                } else if (e.target.value === "card"){
                                    setType("card")
                                }
                            }}>
                                <option value="sealed">Sealed</option>
                                <option value="slab">Slab</option>
                                <option value="card">Raw card</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Card name or product description</label>
                        </td>
                        <td>
                            <input type="text" id="description" name="description" onChange={(e) => setDescription(e.target.value)}/>
                        </td>
                        <td>
                            language + card name + card number + attributes
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Condition
                        </td>
                        <td>
                            <input type="text" id="condition" name="condition" onChange={(e) => setCondition(e.target.value)}/>
                        </td>
                        <td>
                            e.g. "PSA 9", "CGC PRISTINE", "BGS BLACK LABEL", "nm", "d", "sealed"
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Quantity bought</label>
                        </td>
                        <td>
                            <input type="number" id="description" name="description" onChange={(e) => setQuantity(parseInt(e.target.value))}/>
                        </td>
                        <td className="error-text">
                            Enter for sealed product only. For slabs and raw cards, enter 1
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Price we paid per unit (in dollars)
                        </td>
                        <td>
                            <input type="number" id="acquired_price" name="acquired_price" step="0.01" onChange={(e) => setAcquiredPrice(Math.round(Number(e.target.value) * 100))}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Price we want to sell it for per unit
                        </td>
                        <td>
                            <input type="number" id="sale_price" name="sale_price" step="0.01" onChange={(e) => setSalePrice(Math.round(Number(e.target.value) * 100))}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Consignor name (optional)
                        </td>
                        <td>
                            <input type="text" id="consignor_name" name="consignor_name" onChange={(e) => setConsignorName(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                    <td>
                            Consignor contact info (optional)
                        </td>
                        <td>
                            <input type="text" id="consignor_contact" name="consignor_contact" onChange={(e) => setConsignorContact(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <WhiteTextButton text="Add" onClick={() => {
                                let today = new Date()
                                onSubmit({
                                    id: barcode,
                                    type: type,
                                    description: description,
                                    condition: condition,
                                    acquired_price: acquiredPrice,
                                    sale_price: salePrice,
                                    quantity: quantity,
                                    consignor_name: consignorName,
                                    consignor_contact: consignorContact,
                                    sale_price_date: today.toString(),
                                    sale_date: ""
                                })
                            }}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}