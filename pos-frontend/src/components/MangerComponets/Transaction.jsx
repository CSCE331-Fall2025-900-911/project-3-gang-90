import Button from "@mui/material/Button";
import MangerPage from "./MangerPage"
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";

const API_ROUTE = import.meta.env.VITE_SERVER;;

export default function Transactions(){
        const [rows, setRows] = useState([]);
        const [loading, setLoading] = useState(false);
        const [beginDate, setBeginDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [refresh, setRefresh] = useState(false);
        const [timesUsed, setTimesUsed] = useState([]);
        const [name, setName] = useState([]);
    
    
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
                    const res =  await fetch(`${API_ROUTE}/api/transactions/`);
                    if(!res.ok){
                        throw new Error("response not ok: ", res.status);
                    }
                    const json =  await res.json();
                    console.log(json);
    
                    const rowsWithId = json.map((element, index) => ({
                        id: index, // index as ID
                        ...element
                    }));
                    const tempNames = [];
                    const tempTimesUsed = [];
    
                    json.map((element)=>{
                        tempNames.push(element.name);
                        tempTimesUsed.push(element.timesUsed);
                    })
    
                    setName(tempNames);
                    setTimesUsed(tempTimesUsed);
    
    
    
    
                    setRows(rowsWithId);
                }catch(e){
                    console.error("faild to fetch rows", e);
                }
            }
    
            fetchRows();
    
        },[]);
    
        const columns = [
        { field: 'customerName', headerName: 'Customer Name', width: 200 },
        { field: 'transactionTime', headerName: 'Time', width: 200 },
        { field: 'employeeId', headerName: 'ID', width: 200 },
        { field: 'totalPrice', headerName: 'Price', width: 200 }
    ];
    
    const paginationModel = { page: 0, pageSize: 10 };



    return(
        <MangerPage 
        pageName={"Transactions"}
        child={
        <div className="">
                    <Paper sx={{ height: "100%", width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 15]}
                            sx={{ border: 0 }}
                            getRowId={(rows) => rows.id}
                         />
                     </Paper>
        </div>
        }
        />
    )
}