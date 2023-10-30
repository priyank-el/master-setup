import { Navigate, Outlet } from "react-router-dom"
import Header from "../components/Header"
import TopMenu from "../components/TopMenu"
import Footer from "../components/Footer"


export default function AuthVerify() {
    return (
        localStorage.getItem("JwtToken")
        ?
        <>
            <Header />
            <TopMenu />
            <div className="col-start-2 col-span-5 m-3">
                <Outlet />
            </div>
            <Footer />
        </>
        : <Navigate to='/' />)
}