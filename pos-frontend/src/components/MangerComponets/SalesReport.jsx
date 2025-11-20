import Button from "@mui/material/Button";
import MangerPage from "./MangerPage"
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect } from "react";



export default function SalesReport(){

    const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'firstName', headerName: 'First name', width: 230 },
  { field: 'lastName', headerName: 'Last name', width: 230 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 100,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 260,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const paginationModel = { page: 0, pageSize: 5 };
const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];



    // useEffect({





    // },[]);

    return(
        <MangerPage  
        pageName={"Sales Report"}
        child={
            <div>
                <div className="flex p-5">
                    <div className="p-5 flex">
                        <p className="p-10">
                        Start date:
                        </p>
                        <input type="date"></input>
                    </div>
                    <div className="p-5 flex">
                        <p className="p-10 ">
                        End date:
                        </p>
                        <input  type="date"></input>
                    </div>
                    
                </div>
                <div className="flex">
                    <div className="p-2">
                        <Button>Today</Button>
                    </div>
                    <div className="p-2">
                        <Button>Last 7 days</Button>
                    </div>
                    <div className="p-2">
                        <Button>Last 30 days</Button>
                    </div>
                    <div className="p-2"> 
                        <Button>This month</Button>
                    </div>
                </div>
                <div>
                    <BarChart
                        xAxis={[
                            {
                            id: 'barCategories',
                            data: ['bar A', 'bar B', 'bar C'],
                            },
                        ]}
                        series={[
                            {
                            data: [2, 5, 3],
                            },
                        ]}
                        // height={400}
                        // width={1000}
                        sx={{height: 400, width: '100%'}}
                    />
                </div>
                <div>
                    <Paper sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            sx={{ border: 0 }}
                         />
                     </Paper>
                </div>
            </div>
        }/>
    );


}