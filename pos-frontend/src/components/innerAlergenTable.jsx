export default function InnerAlergenTable({ allergens, type }) {
  return (
    <div className="mb-2">
      <span className="font-semibold text-gray-700">{type}</span>{" "}
      <span className="text-gray-900">
        {allergens.length > 0 ? allergens.join(", ") : "None"}
      </span>
    </div>
  );
}
