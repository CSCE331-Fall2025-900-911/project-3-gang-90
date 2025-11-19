// import {Box, Flex} from "@chakra-ui/reat"
import MangerSideBar from "./MangerSideBar"
import MangerTopBar from "./MangerTopBar"


export default function MangerPage({
    child,
    pageName,




}){


    return(
        <div>
            <div>
                <MangerTopBar pageName={pageName}/>
            </div>
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
        </div>
    )




}