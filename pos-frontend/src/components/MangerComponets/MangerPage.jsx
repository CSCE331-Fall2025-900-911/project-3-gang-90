// import {Box, Flex} from "@chakra-ui/reat"
import MangerSideBar from "./MangerSideBar"


export default function MangerPage({
    child,




}){


    return(

        <div>
            test
            <div>
                <MangerSideBar/>
            </div>
            <div className="mangerMainPageMargins">
                <div className="w-full">
                    {child}
                </div>
            </div>
        </div>
    )




}