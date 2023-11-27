import { lazy } from "react"

// COMMON ROUTES:
const ForgotPasswordView  = lazy(()=> import( "../views/account/ForgotPassword"))
const SignInView = lazy(()=> import("../views/account/SignIn"))
const SignUpView = lazy(()=> import("../views/account/SignUp"))
const OtpVerification = lazy(()=>import("../views/account/OtpVerification"))
const UpdatNewPassword = lazy(()=>import("../views/account/UpdateNewPassword")) 
const MyProfileView = lazy(()=>import("../views/account/MyProfile"))
const Details = lazy(()=>import("../views/product/List"))
const CartView = lazy(()=>import("../views/cart/Cart"))

// AUTHENTICATED ROUTES:
const HomeView = lazy(()=>import( "../views/Home"))
const Profile = lazy(()=>import("../views/account/Profile"))

const NotFound = lazy(()=>import("../views/NotFound"))

//STATING
const routes = [
    {
        path: '/',
        component: SignInView,
        exact: true,
        name: "sign-in",
        auth: false
    },
    {
        path: '/signup',
        component: SignUpView,
        exact: true,
        name: "sign-up",
        auth: false
    },
    {
        path: '/forgotpassword',
        component: ForgotPasswordView,
        exact: true,
        name: "forgot-password",
        auth: false
    },
    {
        path: '/otp-verification',
        component: OtpVerification,
        exact: true,
        name: "otp verification",
        auth: false
    },
    {
        path: '/update-password',
        component: UpdatNewPassword,
        exact: true,
        name: "update password",
        auth: false
    },
    {
        path: '/home',
        component: HomeView,
        exact: true,
        name: "Home page",
        auth: true
    },
    {
        path: '/user-profile',
        component: Profile,
        exact: true,
        name: "user profile page",
        auth: true
    },
    {
        path: '/update-profile',
        component: MyProfileView,
        exact: true,
        name: "update user profile",
        auth: true
    },
    {
        path: '/products',
        component: Details,
        exact: true,
        name: "listing products",
        auth: true
    },
    {
        path: '/cart',
        component: CartView,
        exact: true,
        name: "listing products",
        auth: true
    },
    {
        path: '*',
        component: NotFound,
        exact: true,
        name: "update user profile",
        auth: true
    }
]
export default routes