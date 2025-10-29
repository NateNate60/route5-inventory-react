import TextButton from "./buttons";

export default function BackButton () {
    return (
        <div className="back-button">
            <TextButton text="Back" href=".." className="back-button"/>
        </div>
    )
}