import { Button, Stack } from "react-bootstrap"
import { useSelector } from "../../lib/rtk"
import avatar from "../../assets/avatar.svg"
import { Suspense } from "react"
import LoadingComponent from "../Loading"
import { formatMessageDate } from "../../utils/dateDivider"
import { useNavigate } from "react-router-dom"

export default function FriendRequestsComponent() {
    const user = useSelector(state => state.user)
    const welcomeUsername = user?.name.slice(0, user?.name.indexOf(" "))
    const navigate = useNavigate()

    let fRequests = [
        {
            _id: 1,
            name: "user-1",
            email: "user-1@mail.com",
            phone: "+202022020200",
            gender: "male",
            media: null,
            created_at: "29/5/2025",
            updated_at: "29/5/2025"
        },
        {
            _id: 2,
            name: "user-2",
            email: "user-2@mail.com",
            phone: "+202022020200",
            gender: "male",
            media: null,
            created_at: "29/5/2025",
            updated_at: "29/5/2025"
        },
        {
            _id: 3,
            name: "user-3",
            email: "user-3@mail.com",
            phone: "+202022020200",
            gender: "male",
            media: null,
            created_at: "29/5/2025",
            updated_at: "29/5/2025"
        },
        {
            _id: 4,
            name: "user-4",
            email: "user-4@mail.com",
            phone: "+202022020200",
            gender: "male",
            media: null,
            created_at: "29/5/2025",
            updated_at: "29/5/2025"
        },
    ]

    const username = (user) => {
        return user?.name.includes(" ") ? 
        user?.name.slice(0, user?.name.indexOf(" ")) :
        user?.name
    }

    return (
        <Stack
            direction="vertical"
            gap={3}
            className="align-items-center justify-content-start"
        >
            <h2 className="align-self-start"><span style={{ textTransform: "capitalize"}}>{welcomeUsername}</span>&apos;s friend requests</h2>
            <Stack
                direction="vertical"
                className="requests-container"
            >
                {
                    fRequests?.map((req) => {
                        return (
                            <div key={req?._id} className="request">
                                <div className="request-card" role="button" onClick={() => {
                                    navigate(`/friend/${req?._id}`)
                                }}>
                                    <Suspense fallback={<LoadingComponent />}>
                                        <img 
                                            src={req?.media?.preview_url || avatar} 
                                            alt="req-pic"
                                            width={50}
                                            height={50}
                                            loading="lazy"
                                        />
                                    </Suspense>
                                    <div className="request-info">
                                        <h5 className="m-0 p-0">{req?.name}</h5>
                                        <p className="m-0 p-0">{req?.email}</p>
                                    </div>
                                    <div className="request-date">
                                        {username(req)} sent you a friend request!
                                        <br />
                                        at {formatMessageDate(req?.created_at)}
                                    </div>
                                </div>
                                <div className="actions">
                                    <Button variant="primary">Accept</Button>
                                    <Button variant="danger">Reject</Button>
                                </div>
                            </div>
                        )
                    })
                }
            </Stack>
        </Stack>
    )
}
