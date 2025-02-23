import RestInfo from "../components/rests/RestInfo.jsx";
import RestReviews from "../components/rests/RestReviews.jsx";
import Header from "../components/layout/Header.jsx";

export default function MyPage() {
  return (
    <>
      <Header />
      <div className="mt-16 flex flex-col justify-center gap-3 px-2 py-10 min-[760px]:mt-0 min-[760px]:h-svh min-[760px]:max-h-[1500px] min-[760px]:min-w-[80%] min-[760px]:flex-row min-[760px]:pt-28">
        <RestInfo />
        <RestReviews />
      </div>
    </>
  );
}
