import {createBrowserRouter} from "react-router-dom"
import Home from "./auth/pages/Home"
import Login from "./auth/pages/Login"
import Register from "./auth/pages/Register"
import Protected from "./auth/components/Protected"

const router = createBrowserRouter([
  {
    path: "/",    element: <Protected><Home/></Protected>           //home page is protected and can only be accessed by authenticated users
},
{
    path: "/login",    element: <Login />
},
{
    path: "/register",    element: <Register />
}
])

export default router