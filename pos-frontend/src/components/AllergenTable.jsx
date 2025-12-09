import { useEffect, useState } from "react";
import InnerAlergenTable from "./innerAlergenTable";

const API_ROUTE = import.meta.env.VITE_SERVER;


function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AllergenTable({ mods, itemName }) {
  const [drinkAllergen, setDrinkAllergen] = useState([]);
  const [toppingAllergen, setToppingAllergen] = useState([]);
  const [previousMods, setPreviousMods] = useState(mods);

  useEffect(() => {
    const getDrinkAllergen = async () => {
      try {
        const url = `${API_ROUTE}/api/menu/${itemName.toLowerCase()}/allergens`;
        const resp = await fetch(url);

        if (!resp.ok) throw new Error("Failed to load drink allergens");

        const allergens = await resp.json();
        const formatted = allergens.map(a => toTitleCase(a));

        setDrinkAllergen(formatted);
      } catch (e) {
        console.error("Drink allergen load failed:", e);
      }
    };

    getDrinkAllergen();
  }, [itemName]);

  useEffect(() => {
    const getToppingAllergens = async () => {
      console.log(mods);

      try {
        const toppingMods = mods
          .filter(m => m.startsWith("Toppings:"))
          .map(m => m.split(":")[1].trim());

        if (toppingMods.length === 0) {
          setToppingAllergen([]);
          return;
        }

        console.log("Parsed toppings:", toppingMods);

        const fetches = toppingMods.map(async toppingName => {
          try {
            const encoded = encodeURIComponent(toppingName.toLowerCase());
            const url = `${API_ROUTE}/api/ingredients/${encoded}/allergens`;

            console.log("Fetching:", url);

            const resp = await fetch(url);

            if (resp.status === 404) {
              console.warn(`No allergens found for ${toppingName} (404). Skipping.`);
              return [];
            }

            if (!resp.ok)
              throw new Error(`Failed to load allergens for topping: ${toppingName}`);

            const allergens = await resp.json();
            return allergens.map(a => toTitleCase(a));

          } catch (err) {
            console.error(`Error fetching allergens for "${toppingName}":`, err);
            return [];
          }
        });

        const allResults = await Promise.all(fetches);
        const merged = allResults.flat();

        setToppingAllergen([...new Set(merged)]);
      } catch (e) {
        console.error("Topping allergen load failed:", e);
      }
    };

    getToppingAllergens();
  }, [mods]);

  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <h1 className="text-red-500 text-lg font-bold mb-3">ALLERGENS</h1>

      <InnerAlergenTable
        allergens={drinkAllergen}
        type="Allergens in Drink:"
      />

      <InnerAlergenTable
        allergens={toppingAllergen}
        type="Allergens in Toppings:"
      />
    </div>
  );
}
