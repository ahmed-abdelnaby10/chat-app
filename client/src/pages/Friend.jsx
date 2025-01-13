import { useParams } from "react-router-dom"

export default function Friend() {
    const { friendId } = useParams()
    
    return (
        <div>Friend : {friendId}</div>
    )
}
