import uploadPricingData from "@/backend/uploadPricingData";
import WhiteTextButton from "@/components/buttons/whitebutton";
import { useState } from "react";

export default function PriceManagement () {

    const [file, setFile] = useState<File>()
    const [errorText, setError] = useState<string>("")

    return <div id="price-management" className="management-section">
        <h2 className="section-title">Update TCG Player Prices</h2>
        <table className="fullwdith">
            <tbody>
                <tr>
                    <td colSpan={2}>
                        Upload a file exported from TCG Player
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="file" name="file" onChange={ (e) => {
                            if (e.target.files) {
                                let upload = e.target.files[0]
                                if (upload.name.split('.').pop() === "csv") {
                                    setFile(e.target.files[0])
                                    setError("")
                                }
                                else {
                                    setError("Only csv files are accepted here")
                                }
                            }
                        }}/>
                    </td>
                    <td>
                        <WhiteTextButton text='Upload' onClick={ () => {
                            if (file !== undefined) {
                                uploadPricingData(file)
                                .then( (response) => {
                                    if (typeof response === "number") {
                                        setError(`Processed ${response} records`)
                                    } else {
                                        setError(response.error)
                                    }
                                })
                                setError("Processing...")
                            } else {
                                setError("Select a valid file")
                            }
                        }}/>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2} className="error-text">
                        {errorText}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}