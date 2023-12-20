export interface CreateTextInputProps {
    placeholder: string;
}

export default function CreateTextInput(props: CreateTextInputProps) {
    return (
        <input type="text" placeholder="Enter a title" />
    )
}
