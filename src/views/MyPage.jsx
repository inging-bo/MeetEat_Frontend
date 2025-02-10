import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
    return (
        <>
            <Header />
            <div className="w-full max-w-[1200px] h-full pt-40 pb-20 flex gap-[30px]">
                <RestInfo/>
                <RestReviews/>
            </div>
        </>
    )
}
