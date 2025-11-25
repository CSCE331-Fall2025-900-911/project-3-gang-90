import Button from "@mui/material/Button";
import MangerPage from "./MangerPage"
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import.meta.env.VITE_SERVER;

const API_ROUTE = import.meta.env.VITE_SERVER;
export default function SalesReport(){
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [beginDate, setBeginDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [refresh, setRefresh] = useState(false);



    function applyToday(){
        const startDay = new Date();
        const endDay = new Date();

        startDay.setDate(startDay.getDate()-1);

        const databaseStart = startDay.toISOString().split("T")[0];
        const databaseEnd = endDay.toISOString().split("T")[0];

        setEndDate(databaseEnd);
        setBeginDate(databaseStart);

        setRefresh(!refresh);
    }

    function applyMonth(){

                const now = new Date();


        const startOfMonth = new Date(now.getFullYear(), now.getMonth() -1, now.getDay());
        const endOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDay());


        const databaseStart = startOfMonth.toISOString().split("T")[0];
        const databaseEnd = endOfMonth.toISOString().split("T")[0];

        setEndDate(databaseEnd);
        setBeginDate(databaseStart);
        setRefresh(!refresh);
    }

    function apply30Days(){
         const startDay = new Date();
        const endDay = new Date();

        startDay.setDate(startDay.getDate()-30);

        const databaseStart = startDay.toISOString().split("T")[0];
        const databaseEnd = endDay.toISOString().split("T")[0];
        
        setEndDate(databaseEnd);
        setBeginDate(databaseStart);

        setRefresh(!refresh);
    }

    function apply7Days(){
         const startDay = new Date();
        const endDay = new Date();

        startDay.setDate(startDay.getDate()-7);

        const databaseStart = startDay.toISOString().split("T")[0];
        const databaseEnd = endDay.toISOString().split("T")[0];
        
        setEndDate(databaseEnd);
        setBeginDate(databaseStart);

        setRefresh(!refresh);
    }





    useEffect(()=>{
         async function fetchRows(){
            
            try{
                const res =  await fetch(`${API_ROUTE}/api/ingredients/sales-report?start=${beginDate}&end=${endDate}`);
                if(!res.ok){
                    throw new Error("response not ok: ", res.status);
                }
                const json =  await res.json();
                console.log(json);

                const rowsWithId = json.map((element, index) => ({
                    id: index, // index as ID
                    ...element
                }));
                setRows(rowsWithId);
            }catch(e){
                console.error("faild to fetch rows", e);
            }
        }

        fetchRows();

    },[refresh]);

    const columns = [
  { field: 'itemName', headerName: 'Name', width: 200 },
  { field: 'time', headerName: 'Time', width: 330 },
];

const paginationModel = { page: 0, pageSize: 5 };
// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];




    // useEffect({





    // },[]);

    return(
        <MangerPage  
        pageName={"Sales Report"}
        child={
            <div className="">
                <div className="flex p-5">
                    <div className="p-5 flex">
                        <p className="p-10">
                        Start date:
                        </p>
                        <input type="date" onInput={(e)=>{setBeginDate(e.target.value)}}></input>
                    </div>
                    <div className="p-5 flex">
                        <p className="p-10 ">
                        End date:
                        </p>
                        <input  type="date" onInput={(e)=>{setEndDate(e.target.value)}}></input>
                    </div>

                    <Button  variant="contained" onClick={()=>{setRefresh(!refresh)}}>Apply!</Button>
                    
                </div>
                <div className="flex">
                    <div className="p-2">
                        <Button variant="contained" onClick={applyToday}>Today</Button>
                    </div>
                    <div className="p-2">
                        <Button variant="contained" onClick={apply7Days}>Last 7 days</Button>
                    </div>
                    <div className="p-2">
                        <Button  variant="contained" onClick={apply30Days}>Last 30 days</Button>
                    </div>
                    <div className="p-2"> 
                        <Button variant="contained" onClick={applyMonth}>This month</Button>
                    </div>
                </div>
                <div>
                    <Paper sx={{ height: 500, width: '75%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            sx={{ border: 0 }}
                            getRowId={(rows) => rows.id}
                         />
                     </Paper>
                </div>
            </div>
        }/>
    );


}