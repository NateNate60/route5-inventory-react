export default function MonthSelection (props) {
    if (!props.disable) {
        return (
            <input type="month" onChange={props.onChange}/>
        )
    }

    return (
        <input type="month" disabled/>
    )
}
