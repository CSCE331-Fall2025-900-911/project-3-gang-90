



export function getMenu(){
    fetch('/menu')
        .then(res =>{
            if(!res.ok){
                throw new Error(`Server responed with ${res.status}`);
            }


           return res.json();
        }
    ).catch(err=>{
        console.error("Error fetching item: ", err.message);
    })
}