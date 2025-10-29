import BlueTextButton from "@/components/buttons/buttons";
import GreenTextButton from "@/components/buttons/buttons";
import OrangeTextButton from "@/components/buttons/buttons";
import WhiteTextButton from "@/components/buttons/buttons";

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
                            <GreenTextButton text="Buy" onClick={() => onClick("bulk")}/>
                        </td>
                        <td>
                            <OrangeTextButton text="Sell" onClick={() => onClick("sell")}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}