



export default function AllergenTable({type, allergens}){


    return(<div>
        <h1>{type}</h1>
        <div className="flex">
        {allergens.map((allergen)=>{
            return(<p>{allergen}</p>)
        })}
        </div> 
        </div>)




}