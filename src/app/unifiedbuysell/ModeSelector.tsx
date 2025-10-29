import TextButton from "@/components/buttons/buttons"

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
                            <TextButton colour="green" text="Buy" onClick={() => onClick("bulk")}/>
                        </td>
                        <td>
                            <TextButton colour="orange" text="Sell" onClick={() => onClick("sell")}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}