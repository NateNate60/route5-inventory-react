import "@/css/buttons.css"

interface TextButtonProps {
    href?: string,
    text: string,
    onClick?: () => void,
    id?: string,
    colour?: string,
    width?: number,
    submit?: boolean
}

export default function TextButton ({href, text, onClick, id, colour = "white", width, submit = false}: TextButtonProps) {

    return <span>
        <a href={href}>
            <button className={colour ? `${colour}-button` : ''} type={submit ? "submit" : "button"} onClick={onClick} id={id} style={{width: width}}>
                {text} 
            </button>
        </a>
    </span>
}

export function BlueTextButton ({href, text, onClick, id, width}: TextButtonProps) {
    return <TextButton href={href} text={text} onClick={onClick} id={id} width={width} colour="blue"/>
}

export function GreenTextButton ({href, text, onClick, id, width}: TextButtonProps) {
    return <TextButton href={href} text={text} onClick={onClick} id={id} width={width} colour="green"/>
}

export function RedTextButton ({href, text, onClick, id, width}: TextButtonProps) {
    return <TextButton href={href} text={text} onClick={onClick} id={id} width={width} colour="red"/>
}

export function OrangeTextButton ({href, text, onClick, id, width}: TextButtonProps) {
    return <TextButton href={href} text={text} onClick={onClick} id={id} width={width} colour="orange"/>
}

export function WhiteTextButton ({href, text, onClick, id, width}: TextButtonProps) {
    return <TextButton href={href} text={text} onClick={onClick} id={id} width={width} colour="white"/>
}