


export default function InnerAlergenTable({type, allergens}){
    return(
        <div>
        <h1>{type}</h1>
        <div className="flex">
        {allergens.map((allergen)=>{
            return(<p className="p-2">{allergen}</p>)
        })}
        </div>
        </div> 
    )
}