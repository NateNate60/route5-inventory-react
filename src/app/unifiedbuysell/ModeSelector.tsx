import BlueTextButton from "@/components/buttons/bluebuttton";
import GreenTextButton from "@/components/buttons/greenbutton";
import OrangeTextButton from "@/components/buttons/orangebutton";
import WhiteTextButton from "@/components/buttons/whitebutton";

interface ModeSelectorProps {
    onClick: (mode: "buy" | "sell" | "trade" | "bulk") => any
}

export default function ModeSelector ({onClick}: ModeSelectorProps) {
    return (
        <div id="mode-selector">
            <table className="fullwidth">
                <tbody>
                    <tr>
                       <td>
                            <GreenTextButton text="Buy" onClick={() => onClick("buy")}/>
                        </td>
                        <td>
                            <OrangeTextButton text="Sell" onClick={() => onClick("sell")}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <WhiteTextButton text="Trade" onClick={() => onClick("trade")}/>
                        </td>
                        <td>
                            <BlueTextButton text="Bulk" onClick={() => onClick("bulk")}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}