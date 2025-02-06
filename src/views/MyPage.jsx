import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
    return (
        <>
            <Header />
            <div className="flex gap-6 w-full px-6 py-6 mt-auto h-full max-h-[calc(100%-4rem)]">
                <RestInfo/>
                <RestReviews/>
            </div>
        </>
    )
}
