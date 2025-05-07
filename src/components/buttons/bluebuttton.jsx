export default function BlueTextButton (props) {
    return (
        <span style={{float: props.float}}>
            <a href={props.href}>
                <button className="blue-button" type="button" onClick={props.onClick}>
                    {props.text} 
                </button>
            </a>
        </span>

    )
}