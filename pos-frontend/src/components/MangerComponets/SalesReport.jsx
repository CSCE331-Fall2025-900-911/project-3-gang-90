import Button from "@mui/material/Button";
import MangerPage from "./MangerPage"
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';



export default function SalesReport(){




    return(
        <MangerPage  
        pageName={"Sales Report"}
        child={
            <div>
                 <h1>hi</h1>
                <p> 
                    my name is Brendan
                </p>
                <div>
                    Start date:
                    <input type="date"></input>
                    end date:
                    <input type="date"></input>
                    
                </div>
                <div>
                    <Button >Today</Button>
                    <Button>Last 7 days</Button>
                    <Button>Last 30 days</Button>
                    <Button>This month</Button>
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
                        height={300}
                    />
                </div>
                <div>
                    <table>
                        <tr>
                            <td>Item</td>
                            <td>Time</td>
                        </tr>
                    </table>
                </div>
            </div>
        }/>
    );


}