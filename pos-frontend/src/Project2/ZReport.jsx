import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReportTable from './ReportTable'
import MangerPage from '../components/MangerComponets/MangerPage'

const ZReport = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
<MangerPage 
pageName={"Z-Report"}
child={        <div className='flex-1 flex min-h-0 flex-col overflow-hidden'>
          <p className='font-bold text-3xl pb-5'>Z Report</p>
          <div className='flex flex-row w-1/2 items-center gap-7 pb-5'>
            <button onClick={()=>setRefreshKey(k=>k+1)} className='border-2 p-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer'>Refresh</button>
            {/* havent implemented the reset logic yet */}
            <button className='border-2 p-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer'>Finalize (Reset)</button>
          </div>
          <p className='font-bold'>Total Sales:</p>
          {/* change here */}
          <p className='text-3xl pb-5'>$0.00</p>
          {/* ----------- */}
          <p className='font-bold'>Per-Employee Summary:</p>
          <div className='flex-none h-[480px] overflow-auto rounded-md border mb-5 border-gray-300 bg-white p-4 shadow-sm'>
            <ReportTable refreshSignal={refreshKey} />
          </div>
          <div className='pb-4' />

        </div>
}/>

  )
}

export default ZReport