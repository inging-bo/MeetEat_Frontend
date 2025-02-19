import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
  return (
    <>
      <Header/>
      <div
        className="flex px-2 basis-full flex-wrap h-full justify-center mt-[90px] gap-3
        sm:max-w-[1200px] sm:px-5 sm:w-full sm:pt-40 sm:pb-20 sm:mx-0 sm:mt-0 sm:gap-[30px] "
      >
        <RestInfo/>
        <RestReviews/>
      </div>
    </>
  );
}
