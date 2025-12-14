//import {Box, Flex} from "@chakra-ui/reat"
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



export default function MangerSideBar(){

    return(
        <div className='mangerSideBar' >
<<<<<<< HEAD
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/cashier">Cashier</Link>
            </div>
=======
            {/* <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/cashier">Cashier</Link>
            </div> */}
>>>>>>> sprint-3
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/transactions">Transactions</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/products">Products</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink' to="/ingredients">Ingredients</Link>
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