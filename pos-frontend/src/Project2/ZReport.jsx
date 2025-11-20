import React from 'react'
import { Link } from 'react-router-dom'

const ZReport = () => {
  return (
    <div className='flex flex-col w-full h-screen'>
    {/* header*/}
      <div className='w-full h-14 shrink-0 flex items-center font-semibold pl-8 text-white bg-gray-600'>Z Report</div> 

      <div className='flex flex-1 min-h-0 w-full'>
        {/* sidebar */}
        <div className='w-1/5 h-full flex justify-evenly items-center bg-gray-400 flex-col'>
          <Link to={"/cashier"}>Cashier</Link>
          <Link to={"/transactions"}>Transactions</Link>
          <Link to={"/products"}>Products</Link>
          <Link to={"/employees"}>Employees</Link>
          <Link to={"/xreport"}>X-Report</Link>
          <Link to={"/usageChart"}>Usage Charge</Link>
          <Link to={"/salesReport"}>Sales Report</Link>
          <Link to={"/reportz"}>Z-Report</Link>
        </div>

        {/* content*/}
        <div className='flex-1 flex flex-col pl-5 pt-5'>
          <p className='font-bold text-3xl pb-5'>Z Report</p>
          <div className='flex flex-row w-1/2 items-center gap-7 pb-5'>
            <button className='border-2 p-1 rounded-lg'>button here</button>
            <button className='border-2 p-1 rounded-lg'>button here</button>
          </div>
          <p className='font-bold'>Total Sales:</p>
          {/* change here */}
          <p className='text-3xl pb-5'>$0.00</p>
          {/* ----------- */}
          <p className='font-bold'>Per-Employee Summary:</p>

        </div>
      </div>
    </div>
  )
}

export default ZReport