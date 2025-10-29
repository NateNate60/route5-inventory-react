import TextButton, { WhiteTextButton } from "./buttons"

interface SubmitButtonProps {
    text: string
}

export default function SubmitButton ({text}: SubmitButtonProps) {
    return <TextButton text={text} submit={true}/>
}