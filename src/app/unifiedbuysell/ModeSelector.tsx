import GreenTextButton from "@/components/buttons/greenbutton";
import OrangeTextButton from "@/components/buttons/orangebutton";
import WhiteTextButton from "@/components/buttons/whitebutton";

interface ModeSelectorProps {
    onClickSell: () => any,
    onClickBuy: () => any,
    onClickTrade: () => any
}

export default function ModeSelector ({onClickSell, onClickBuy, onClickTrade}: ModeSelectorProps) {
    return (
        <div id="mode-selector">
            <table className="fullwidth">
                <tbody>
                    <tr>
                       <td>
                            <GreenTextButton text="Buy" onClick={onClickBuy}/>
                        </td>
                        <td>
                            <OrangeTextButton text="Sell" onClick={onClickSell}/>
                        </td>
                        <td>
                            <WhiteTextButton text="Trade" onClick={onClickTrade}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}