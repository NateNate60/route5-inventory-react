export default function RedTextButton (props) {
    return (
        <span style={{float: props.float}}>
            <a href={props.href}>
                <button className="red-button" type="button" onClick={props.onClick}>
                    {props.text} 
                </button>
            </a>
        </span>

    )
}
