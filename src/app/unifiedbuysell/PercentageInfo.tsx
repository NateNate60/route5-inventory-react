interface PercentageInfoProps {
    buyCards: number,
    buyCash: number,
    buyCredit: number,
    sellCards: number,
    sellCash: number,
    sellCredit: number
}

export default function PercentageInfo ({buyCards, buyCash, buyCredit, sellCards, sellCash, sellCredit}: PercentageInfoProps) {
    return (
        <table className="fullwidth">
            <thead>
                <tr>

                    <th id="summary-value-received">
                        Total value received from customer
                    </th>
                    <th id="summary-percentage">
                        Overall percentage
                    </th>
                    <th id="summary-value-given">
                        Total value given to customer
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="monetary">
                        ${Math.round(buyCards + buyCash + buyCredit) / 100}
                    </td>
                    <td className="monetary">
                        {Math.round((sellCards + sellCash + sellCredit)/ (buyCards + buyCash + buyCredit) * 1000) / 10}%
                    </td>
                    <td className="monetary">
                        ${Math.round(sellCards + sellCash + sellCredit) / 100}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}