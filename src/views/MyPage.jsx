import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
  return (
    <>
      <Header/>
      <div
        className="flex m-4 flex-wrap h-full justify-center mx-20
        {/*xl:flex-nowrap*/}
        sm:flex sm:max-w-[1200px] sm:w-full sm:pt-40 sm:pb-20 sm:mx-0 sm:gap-[30px]"
      >
        <RestInfo/>
        <RestReviews/>
      </div>
    </>
  );
}
