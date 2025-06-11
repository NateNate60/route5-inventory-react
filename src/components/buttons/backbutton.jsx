import WhiteTextButton from "./whitebutton.jsx"

export default function BackButton () {
    return (
        <div className="back-button">
            <WhiteTextButton text="Back" href=".." float="left" className="back-button"/>
        </div>
    )
}