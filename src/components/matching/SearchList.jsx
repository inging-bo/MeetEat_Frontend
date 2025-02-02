export default function SearchList({ marker }) {
  const categoryName = marker.category_name.slice(
    marker.category_name.lastIndexOf(">") + 2
  );

  return (
    <a href={marker.place_url} target="_blank">
      <div className="text-left pt-[10px]">
        <div className="flex flex-row justify-between items-start pb-[8px]">
          <p className="font-bold text-base max-w-[200px]">
            {marker.place_name}
          </p>
          <p className="text-sm text-[#555555]">{categoryName}</p>
        </div>
        <p className="text-sm text-[#555555]">{marker.road_address_name}</p>
        <p className="text-sm pb-2 text-[#555555]">{marker.phone}</p>
        <p className="text-sm pb-[10px] text-[#555555]">
          내 위치에서 {marker.distance}m
        </p>
        <hr className="" />
      </div>
    </a>
  );
}
