import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
  return (
    <>
      <Header />
      <div className="mt-16 flex flex-col justify-center gap-3 px-2 py-10 min-[600px]:h-svh min-[600px]:max-h-[1500px] min-[600px]:flex-row min-[600px]:pt-28 sm:mx-0 sm:mt-0 sm:max-w-[1200px] sm:gap-[30px] sm:px-5">
        <RestInfo />
        <RestReviews />
      </div>
    </>
  );
}
