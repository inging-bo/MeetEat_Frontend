export default function InfoWindow({ marker, choicePlace }) {
  return (
    <div className="drop-shadow-lg fixed">
      <div className="bg-white p-5 rounded-lg w-[320px]">
        <div className="text-left">
          <div className="flex flex-row justify-between items-start pb-[8px]">
            <p className="font-bold text-base max-w-[200px] whitespace-normal">
              {marker.place_name}
            </p>
            <p className="text-sm text-[#555555]">
              {marker.category_name.slice(
                marker.category_name.lastIndexOf(">") + 2
              )}
            </p>
          </div>
          <p className="text-sm text-[#555555]">{marker.road_address_name}</p>
          <p className="text-sm pb-1 text-[#555555]">{marker.phone}</p>
          <a
            href={marker.place_url}
            className="block text-sm text-[#555555] pb-2"
          >
            가게 정보 더보기
          </a>
          <p className="text-sm pb-5 text-[#909090]">
            내 위치에서 {marker.distance}m
          </p>
          <hr className="pb-5" />
          <div>
            <p className="font-bold text-base whitespace-normal pb-2">
              방문할 인원을 선택해주세요.
            </p>
            <div className="flex flex-row justify-between text-sm">
              <p>인원</p>
              <div className="flex flex-row justify-between">
                <p>-</p>
                <p>1</p>
                <p>+</p>
              </div>
            </div>
          </div>
        </div>
        <button
          id="choiceBtn"
          className="bg-[#FF6445] w-full rounded-lg py-2 mt-3 text-white"
          onClick={() => {
            choicePlace(marker);
          }}
        >
          매칭 시작
        </button>
      </div>
    </div>
  );
}
