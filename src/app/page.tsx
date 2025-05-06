import React from "react";

import GreenTextButton from "./components/greenbutton"
import BlueTextButton from "./components/bluebuttton"
import OrangeTextButton from "./components/orangebutton"
import "./style.css"

export default function Home() {
    return (
        <div>
            <h1 className="page-title">Home Page</h1>
            <table>
                <tr>
                    <td>
                        <GreenTextButton text="Buy products from customer"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <OrangeTextButton text="Sell products to customer"/>  
                    </td>
                    <td>
                        <BlueTextButton text="See all inventory"/>
                    </td>
                </tr>
            </table>
            
           
        </div>
    );
}
