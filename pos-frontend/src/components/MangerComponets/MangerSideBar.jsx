//import {Box, Flex} from "@chakra-ui/reat"
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



export default function MangerSideBar(){

    return(
        <div className='mangerSideBar' >
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/cashier">Chashier</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/transactions">Transactions</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/products">Productst</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/employees">Employees</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/reportx">X-Report</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink'to={"/usageReport"}>Usage Report</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to={"/salesReport"}>Sales Report</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link to={"/reportz"} className='mangerLink'>Z-Report</Link>
            </div>
            
        </div>
    )


}