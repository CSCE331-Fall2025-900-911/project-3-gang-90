"use client"
import { useEffect,useState} from "react";

let server = import.meta.env.VITE_SERVER;

export default function Menu() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState();
  //this is an example of how to fetch data

useEffect(()=>{
  
  const getRequst = async() =>{
    setIsLoading(true);
    let res = await fetch(server+'/menu');
    if(!res.ok){
        setError( new Error('Network error'));
        setIsError(true);
    }
    const pendingData = await res.json()
    setData(pendingData);
    console.log(pendingData)
    setIsLoading(false);
  }
  getRequst();


},[])

  if(isLoading){
    return <div>Loading ....</div>
  }

  if(isError){
    return <div>{error.message}</div>
  }
  


  return (
    <main>
      <div>
        
      <h1>Customer Menu (Placeholder)</h1>
      <button>Drink 1</button>
      <button>Drink 2</button>
      <p>
        {data[""]}
      </p>
      </div>
    </main>
  );
}
