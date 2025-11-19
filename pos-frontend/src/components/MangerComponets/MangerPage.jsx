// import {Box, Flex} from "@chakra-ui/reat"
import MangerSideBar from "./MangerSideBar"


export default function MangerPage({
    child,




}){


    return(

        <div className="managerPage">
            <div className="managerSideBarMargins">
                <MangerSideBar/>
            </div>
            <div className="mangerMainPageMargins">
                <div>
                    {child}
                </div>
            </div>
        </div>
    )




}