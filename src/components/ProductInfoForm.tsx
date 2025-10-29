"use client"

import { Product, TCGProductData } from "@/types/Product";
import searchProducts from "@/backend/searchProducts";
import { useState } from "react";
import TextButton from "./buttons/buttons";

interface ProductInforFormProps {
    barcode: string,
    onSubmit: (product: Product) => any
}

export default function ProductInfoForm ({onSubmit, barcode}: ProductInforFormProps) {
    const [description, setDescription] = useState<string>("")
    const [condition, setCondition] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)
    const [consignorName, setConsignorName] = useState<string>("")
    const [consignorContact, setConsignorContact] = useState<string>("")
    const [tcgData, setTCGData] = useState<TCGProductData>()
    const [disableNameInput, setDisableNameInput] = useState<boolean>(false)

    const [suggestions, setSuggestions] = useState<Array<TCGProductData>>([])

    let maybeSuggestions = suggestions.map( (suggestion) => 
        <tr key={suggestion.tcgID}>
            <td>
                {suggestion.setName}
            </td>
            <td>
                {suggestion.canonicalName} {suggestion.attribute}
            </td>
            <td>
                {suggestion.number}
            </td>
            <td>
                <TextButton colour="white" text="Select" onClick={ () => {
                    setDescription(suggestion.canonicalName)
                    setSuggestions([])
                    setDisableNameInput(true)
                    setTCGData(suggestion)
                }}/>
            </td>
        </tr>
    )

    let type: "slab" | "sealed" | "card"
    if (barcode.match(/^((\d{12})|(^[^1]\d{12}))$/)) {
        // UPC
        type = "sealed"
        if (condition == "") {
            setCondition("sealed")
        }
    } else if (barcode.length === 5) {
        // Asset tag
        type = "card"
        if (condition == "card") {
            setCondition("NM")
        }
    } else {
        type = "slab"
    }
    return (
        <form id="productInfoForm">
            <table width={"80%"}>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label>Card name or product description</label>
                        </td>
                        <td>
                            <input type="text" id="description" name="description" onChange={(e) => {
                                let query = e.target.value
                                if (query.length > 2){
                                    setDescription(query)
                                    searchProducts(query, type).then( (suggestions) => {
                                        setSuggestions(suggestions)
                                    })
                                } else {
                                    setSuggestions([])
                                    setDescription(query)
                                }
                            }} value={description} disabled={disableNameInput}/>
                        </td>
                    </tr>
                    {maybeSuggestions}
                    <tr>
                        <td>
                            Condition
                        </td>
                        <td>
                            <ConditionPicker type={type} onChange={ (condition) => {setCondition(condition)} }/>
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
                            <TextButton colour="white" text="Add" onClick={() => {
                                let today = new Date()
                                let info: Product = {
                                    id: barcode,
                                    type: type,
                                    description: description,
                                    condition: condition,
                                    acquired_price: 1,
                                    acquired_date: today.toString(),
                                    sale_price: 1,
                                    quantity: quantity,
                                    consignor_name: consignorName,
                                    consignor_contact: consignorContact,
                                    sale_price_date: today.toString(),
                                    sale_date: "",
                                    tcg_price_data: tcgData
                                }

                                if (info.condition === "") {
                                    // Don't know why this happens but set it to default values if it does
                                    if (info.type === "card") {
                                        info.condition = "NM"
                                    } else if (info.type === "sealed") {
                                        info.condition = "sealed"
                                    } else if (info.type === "slab") {
                                        info.condition = "PSA 10"
                                    }
                                }
                                setDescription("")
                                setQuantity(1)
                                setConsignorContact("")
                                setConsignorName("")
                                onSubmit(info)
                            }}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>

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