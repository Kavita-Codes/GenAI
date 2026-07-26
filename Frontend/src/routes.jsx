import {createBrowserRouter} from "react-router-dom"

import Login from "./auth/pages/Login"
import Register from "./auth/pages/Register"
import Protected from "./auth/components/Protected"
import Home from "./interview/pages/Home"
import Interview from "./interview/pages/Interview"

const router = createBrowserRouter([
{
    path: "/",   
    element: <Protected><Home/> </Protected>    //home page is protected and can only be accessed by authenticated users
},
{
    path: "/login",   
    element: <Login />
},
{
    path: "/register",  
    element: <Register />
},
{
    path:"/interview/:interviewId",
    element: <Protected><Interview /></Protected>
}
])

export default router