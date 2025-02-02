export default function SearchList({ marker }) {
  return (
    <a href={marker.place_url} target="_blank">
      <div className="text-left pt-2 px-4">
        <p className="font-bold drop-shadow-md">{marker.place_name}</p>
        <p className="text-sm drop-shadow-md">{marker.category_name}</p>
        <p className="text-sm pb-2 drop-shadow-md">{marker.phone}</p>
        <hr className="drop-shadow-md" />
      </div>
    </a>
  );
}
