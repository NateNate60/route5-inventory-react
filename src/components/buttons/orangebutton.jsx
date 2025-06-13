import "@/css/buttons.css"

export default function OrangeTextButton (props) {
    return (
        <span style={{float: props.float}}>
            <a href={props.href}>
                <button className="orange-button" type="button" onClick={props.onClick}>
                    {props.text} 
                </button>
            </a>
        </span>

    )
}
