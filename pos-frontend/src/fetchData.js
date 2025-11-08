let server = import.meta.env.VITE_SERVER;

export async function getMenu(){
    try{
        let res = await fetch(server+'/menu');
        if(!res.ok){
            throw new Error('Network error');

        }
        return res.json();
    }catch(err){
        console.log("error: "+err.message);
    }
}


export async function getEmployee(){
    console.log("in getEmployee")
    try{
        let res = await fetch(server+'/employees')
        console.log(server+'/employees');
        if(!res.ok){
            throw new Error(`Server respond with ${res.status}`);
        }
        let data = res.json()
        console.log("data: " ,data)
        return await data;
    }catch(err){
        console.log("faild to fetch employee: ", err.message)
    }
    
    

}


export function addTransactionAndDetails(transaction,itemsList){
    fetch('/menu/addTransactionAndDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({transaction:transaction, itemsList:itemsList})
        })
        .then(res=>{
            if(!res.ok){
                throw new Error(`Server responed with ${res.status}`);
            }


        }).catch(err=>{
            console.log("Error in adding items: ", err.message);
        })
}