import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
  return (
    <>
      <Header/>
      <div
        className="flex-col m-4
        sm:flex sm:flex-row sm:max-w-[1200px] sm:w-full sm:h-full sm:pt-40 sm:pb-20 sm:m-0 sm:gap-[30px]"
      >
        <RestInfo/>
        <RestReviews/>
      </div>
    </>
  );
}
