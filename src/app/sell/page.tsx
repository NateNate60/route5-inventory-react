"use client"

import React, {useState} from "react"
import { ProductQuantityList } from "@/types/ProductQuantityList"
import { Product } from "@/types/Product"
import SearchBar from "@/components/SearchBar"

export default function SellPage () {
    const [products, setProducts] = useState<ProductQuantityList>()
    return (
        <div>
            <SearchBar big={true} onSubmit={(entry: string) => {
                
            }}/>
        </div>
    )
}