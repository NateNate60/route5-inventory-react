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
    const [condition, setCondition] = useState<string>("sealed")
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
                            <input type="text" id="barcode" name="barcode" onChange={(e) => setBarcode(e.target.value)} value={barcode}/>
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
                                    setCondition("sealed")
                                } else if (e.target.value === "slab") {
                                    setType("slab")
                                    setCondition("PSA 10")
                                } else if (e.target.value === "card"){
                                    setType("card")
                                    setCondition("NM")
                                }
                            }} value={type}>
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
                            <input type="text" id="description" name="description" onChange={(e) => setDescription(e.target.value)} value={description}/>
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
                            <ConditionPicker type={type} onChange={ (condition) => {setCondition(condition)} }/>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Quantity bought</label>
                        </td>
                        <td>
                            {type === "sealed" ?
                                <input type="number" id="description" name="description" onChange={(e) => setQuantity(parseInt(e.target.value))} value={description}/>
                            : 1}
                        </td>
                        <td className="error-text">
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Price we paid per unit (in dollars)
                        </td>
                        <td>
                            <input type="number" id="acquired_price" name="acquired_price" step="0.01" onChange={(e) => setAcquiredPrice(Math.round(Number(e.target.value) * 100))} value={acquiredPrice}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Price we want to sell it for per unit
                        </td>
                        <td>
                            <input type="number" id="sale_price" name="sale_price" step="0.01" onChange={(e) => setSalePrice(Math.round(Number(e.target.value) * 100))} value={salePrice}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Consignor name (optional)
                        </td>
                        <td>
                            <input type="text" id="consignor_name" name="consignor_name" onChange={(e) => setConsignorName(e.target.value)} value={consignorName}/>
                        </td>
                    </tr>
                    <tr>
                    <td>
                            Consignor contact info (optional)
                        </td>
                        <td>
                            <input type="text" id="consignor_contact" name="consignor_contact" onChange={(e) => setConsignorContact(e.target.value)} value={consignorContact}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <WhiteTextButton text="Add" onClick={() => {
                                let today = new Date()
                                let info: Product = {
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
                                }
                                setBarcode("")
                                setType("card")
                                setDescription("")
                                setCondition("")
                                setAcquiredPrice(0)
                                setSalePrice(0)
                                setQuantity(1)
                                setConsignorContact("")
                                setConsignorName("")
                                onSubmit(info)
                            }}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}

interface ConditionPickerInterface {
    type: "sealed" | "slab" | "card",
    onChange: (value: string) => any
}

function ConditionPicker ({type, onChange}: ConditionPickerInterface) {
    const [value, setValue] = useState<string>("")

    if (type === "sealed") {
        return (
            <select disabled>
                <option value="sealed">Sealed</option>
            </select>
        )
    } else if (type === "slab") {
        return (
            <GradeSelection onChange={ (grade) => onChange(grade) }/>
        )
    } else if (type === "card") {
        return (
            <select onChange={ (e) => {
                setValue(e.target.value)
                onChange(e.target.value)}
            } value={value}>
                <option value="NM">Near Mint</option>
                <option value="LP">Lightly Played</option>
                <option value="MP">Moderately Played</option>
                <option value="HP">Heavily Played</option>
                <option value="D">Damaged</option>
            </select>
        )
    }
}

interface GradeSelectionProps {
    onChange: (grade: string) => any
}

function GradeSelection ({onChange}: GradeSelectionProps) {
    const [grader, setGrader] = useState<string>("PSA")
    const [grade, setGrade] = useState<string>("10")

    return (
        <span>
            <select onChange={ (e) => {
                setGrader(e.target.value)
                setGrade("10")
                onChange(`${e.target.value} 10`)}
            } value={grader}>
                <option value="PSA">PSA</option>
                <option value="CGC">CGC</option>
                <option value="BGS">BGS</option>
            </select>
            <select onChange={ (e) => {
                setGrade(e.target.value)
                onChange(`${grader} ${e.target.value}`)}
            } value={grade}>
                {grader === "BGS" ? <option value="BLACK LABEL">Black Label 10</option> : undefined}
                {grader === "CGC" ? <option value="PRISTINE">Pristine 10</option> : undefined}
                {grader === "BGS" ? <option value="10">Pristine 10</option> : undefined}
                {grader === "PSA" || grader === "CGC" ? <option value="10">Gem Mint 10</option> : undefined}
                {grader === "BGS" ? <option value="9.5">Gem Mint 9.5</option> : undefined}
                {grader === "CGC" ? <option value="9.5">Mint+ 9.5</option> : undefined}
                <option value="9">9</option>
                <option value="8.5">8.5</option>
                <option value="7.5">7.5</option>
                <option value="7">7</option>
                <option value="6.5">6.5</option>
                <option value="6">6</option>
                <option value="5.5">5.5</option>
                <option value="5">5</option>
                <option value="4.5">4.5</option>
                <option value="4">4</option>
                <option value="3.5">3.5</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
                <option value="AA">Authentic</option>
            </select>
        </span>

    )
}