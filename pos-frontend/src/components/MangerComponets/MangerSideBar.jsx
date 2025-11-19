//import {Box, Flex} from "@chakra-ui/reat"
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



export default function MangerSideBar(){

    return(
        <div className='mangerSideBar' >
            <div className='mangerLinkPadding'>
                <Link className='mangerLink'>sales report</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink'>cashire</Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink'></Link>
            </div>
            <div className='mangerLinkPadding'>
                <Link className='mangerLink'></Link>
            </div>
            
        </div>
    )


}