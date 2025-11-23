import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReportTable from './ReportTable'


const XReport = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className='flex flex-col w-full h-screen'>
    {/* header*/}
      <div className='w-full h-14 shrink-0 flex items-center font-semibold pl-8 text-white bg-gray-600'>X Report</div> 

      <div className='flex flex-1 min-h-0 w-full overflow-hidden'>
        {/* sidebar */}
        <div className='w-1/5 h-full flex justify-start pt-5 gap-5 items-center bg-gray-500 flex-col'>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/cashier"}>Cashier</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/transactions"}>Transactions</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/products"}>Products</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/employees"}>Employees</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/xreport"}>X-Report</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/usageChart"}>Usage Charge</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/salesReport"}>Sales Report</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/reportz"}>Z-Report</Link>
        </div>

        {/* content*/}
        <div className='flex-1 flex min-h-0 flex-col pl-6 pr-6 pt-5 overflow-hidden'>
          <p className='font-bold text-3xl pb-5'>X Report</p>
          <div className='flex flex-row w-1/2 items-center gap-7 pb-5'>
            <button onClick={()=>setRefreshKey(k=>k+1)} className='border-2 p-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer'>Refresh</button>
          </div>
          <div className='flex flex-row gap-4 w-full'>
            <div>
              <p className='font-bold'>Total Sales:</p>
              {/* change here */}
              <p className='text-3xl pb-5'>$0.00</p>
              {/* ----------- */}
            </div>
            <div>
              <p className='font-bold'>Total Transactions:</p>
              {/* change herer */}
              <p className='text-3xl pb-5'>0</p>
              {/* ------------ */}
            </div>
          </div>
          <p className='font-bold'>Per-Employee Summary:</p>
          {/* table region fills remaining vertical space */}
          <div className='flex-1 min-h-0 overflow-auto rounded-md border mb-5 border-gray-300 bg-white'>
            <ReportTable refreshSignal={refreshKey} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default XReport