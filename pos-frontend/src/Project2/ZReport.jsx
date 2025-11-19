import React from 'react'
import { Link } from 'react-router-dom'

const ZReport = () => {
  return (
    <div className='flex flex-col w-full h-screen'>
    {/* header */}
      <div className='w-full h-14'>Z Report</div> 

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

        {/* content */}
        <div className='flex-1'>
          <p> text </p>
        </div>
      </div>
    </div>
  )
}

export default ZReport