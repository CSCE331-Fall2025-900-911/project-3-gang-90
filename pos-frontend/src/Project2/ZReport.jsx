import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReportTable from './ReportTable'
import MangerPage from '../components/MangerComponets/MangerPage'

const ZReport = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [finalized, setFinalized] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const API_ROUTE = import.meta.env.VITE_SERVER;

  useEffect(() => {
    async function fetchTodayTotals() {
      try {
        if (finalized) { setTotalSales(0); setTotalTransactions(0); return; }
        const res = await fetch(`${API_ROUTE}/api/transactions?page=0&pageSize=5000`);
        if (!res.ok) return;
        const data = await res.json();
        const rows = Array.isArray(data) ? data : (Array.isArray(data.rows) ? data.rows : []);
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth();
        const dd = today.getDate();
        let sales = 0;
        let count = 0;
        for (const tx of rows) {
          const t = new Date(tx.transaction_time ?? tx.transactionTime);
          if (t.getFullYear() === yyyy && t.getMonth() === mm && t.getDate() === dd) {
            sales += Number(tx.total_price ?? tx.totalPrice ?? 0);
            count += 1;
          }
        }
        setTotalSales(sales);
        setTotalTransactions(count);
      } catch (e) {
        setTotalSales(0);
        setTotalTransactions(0);
      }
    }
    fetchTodayTotals();
  }, [refreshKey, finalized]);
  return (
<MangerPage 
pageName={"Z-Report"}
child={        <div className='flex-1 flex min-h-0 flex-col overflow-hidden'>
          <p className='font-bold text-3xl pb-5'>Z Report</p>
          <div className='flex flex-row w-1/2 items-center gap-7 pb-5'>
            <button onClick={()=>setRefreshKey(k=>k+1)} className='border-2 p-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer'>Refresh</button>
            {/* havent implemented the reset logic yet */}
            <button onClick={() => { setFinalized(true); setRefreshKey(k=>k+1); }} className='border-2 p-1 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer'>Finalize (Reset)</button>
          </div>
          <p className='font-bold'>Total Sales:</p>
          <p className='text-3xl pb-5'>${totalSales.toFixed(2)}</p>
          <p className='font-bold'>Total Transactions:</p>
          <p className='text-3xl pb-5'>{totalTransactions}</p>
          <p className='font-bold'>Per-Employee Summary:</p>
          {!finalized ? (
            <div className='flex-none h-[480px] overflow-auto rounded-md border mb-5 border-gray-300 bg-white p-4 shadow-sm'>
              <ReportTable refreshSignal={refreshKey} />
            </div>
          ) : (
            <div className='flex-none h-[480px] overflow-auto rounded-md border mb-5 border-gray-300 bg-white p-4 shadow-sm flex items-center justify-center text-gray-500'>
              Report finalized. No data for the day.
            </div>
          )}
          <div className='pb-4' />

        </div>
}/>

  )
}

export default ZReport