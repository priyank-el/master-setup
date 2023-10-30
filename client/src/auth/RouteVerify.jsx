import { Navigate, Outlet } from "react-router-dom"


export default function RouteVerify () {
    return (localStorage.getItem("JwtToken") ? <Navigate to='/home' /> : <Outlet />)
}