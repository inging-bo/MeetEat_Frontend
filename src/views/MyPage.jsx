import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";

export default function MyPage() {
    return (
        <div className="flex self-end flex-1 px-6 py-6 h-[calc(100vh-4rem)]">
            <RestInfo/>
            <RestReviews/>
        </div>
    )
}
