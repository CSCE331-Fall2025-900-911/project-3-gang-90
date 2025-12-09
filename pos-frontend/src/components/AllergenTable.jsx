import { useEffect, useState } from "react";
import InnerAlergenTable from "./innerAlergenTable";

const API_ROUTE = import.meta.env.VITE_SERVER;;

export default function AllergenTable({ mods, itemName}){
      const [drinkAllergen, setDrinkAllergen] = useState(["Wheat"]);
      const [toppingAllergen, setTopingAllergen] = useState([]);
      const [perviousMod, setPerviousMod] = useState(mods);
      //const [perviousMod, setPerviousMod] = useState(["Egg","More Eggs"]);
    
      //need to fetch the basic allergens for the drink
      useEffect(()=>{
        const getDrinkAllergen = async ()=>{
          try{
            console.log(API_ROUTE+`/api/${itemName}/allergen`)
          const resp  = await fetch(API_ROUTE+`/api/${itemName}/allergen`);
          if(!resp.ok){

            throw new Error("failed to load");
          }
          const allergens = resp.json();
          console.log(allergens)
          //setDrinkAllergen(allergens);
    
          }catch(e){
            console.error("Failed to load: ", e);
          }
    
    
    
        }
        getDrinkAllergen();
      },[]);
    
    //fetch the allergens for the topoings
    
    useEffect(()=>{
      const getToppingAllergens = async()=>{
        try{
          for(i = 0; i < mods.length(); i++){
            const resp  = await fetch();
            if(!resp.ok){
              throw new Error("failed to load");
            }
            const allergens = resp.json();
    
            setTopingAllergen(...allergens);
           }
          }catch(e){
            console.error("Failed to load: ", e);
          }
     
    
        
      }
    
     const moreEggs = toppingAllergen;
     if(perviousMod.length < mods.length ){
        moreEggs.push("More Eggs");
     }else{
        moreEggs.pop();
     }
     
      setTopingAllergen(moreEggs);
      setPerviousMod(mods);
    
      },[mods])


    return(<div>
        <div className='bg-gray-200 rounded-lg p-3'>
          <h1 className='text-red-500'><strong>ALERGENS</strong></h1>
          <div>
          <InnerAlergenTable allergens={drinkAllergen} type="Allergen in drink:"/>
          <InnerAlergenTable allergens={toppingAllergen} type="Allergen in topings:"/>
          </div>
        </div>
        </div>)




}