import React, { Suspense, lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import routes from './routes/routes'
import AuthVerify from "./auth/AuthVerify"
import RouteVerify from "./auth/RouteVerify"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./App.min.css"

const HomeView = lazy(() => import("./views/Home"))
// <<<<<<< HEAD
const SignInView = lazy(() => import("./views/account/SignIn"))
const SignUpView = lazy(() => import("./views/account/SignUp"))
const OtpVerification = lazy(() => import("./views/account/OtpVerification"))
const ForgotPasswordView = lazy(() => import("./views/account/ForgotPassword"))

// >>>>>>> 30-oct-2023-client-side-development
const UpdatNewPassword = lazy(() => import("./views/account/UpdateNewPassword"))
const OrdersView = lazy(() => import("./views/account/Orders"))
const WishlistView = lazy(() => import("./views/account/Wishlist"))
const NotificationView = lazy(() => import("./views/account/Notification"))
const ProfileView = lazy(() => import("./views/account/Profile"))
const MyProfileView = lazy(() => import("./views/account/MyProfile"))
const ProductListView = lazy(() => import("./views/product/List"))
const ProductDetailView = lazy(() => import("./views/product/Detail"))
const StarZoneView = lazy(() => import("./views/product/StarZone"))
const CartView = lazy(() => import("./views/cart/Cart"))
const CheckoutView = lazy(() => import("./views/cart/Checkout"))
const InvoiceView = lazy(() => import("./views/cart/Invoice"))
const DocumentationView = lazy(() => import("./views/Documentation"))
const NotFoundView = lazy(() => import("./views/pages/404"))
const InternalServerErrorView = lazy(() => import("./views/pages/500"))
const ContactUsView = lazy(() => import("./views/pages/ContactUs"))
const SupportView = lazy(() => import("./views/pages/Support"))
const BlogView = lazy(() => import("./views/blog/Blog"))
const BlogDetailView = lazy(() => import("./views/blog/Detail"))

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>

        <Suspense
          fallback={
            <div className="text-white text-center mt-3">Loading...</div>
          }
        >
          <Routes>
            {
              routes.map(({ path, component: Comp, auth }, index) => {
                return (
                  auth == true ?
                    <>
                      <Route key={index} path={path} element={<AuthVerify />}>
                        <Route path={path} element={<Comp />} />
                      </Route>
                    </>

                    : auth == false ?
                      <Route key={index} path={path} element={<RouteVerify />}>
                        <Route path={path} element={<Comp />} />
                      </Route>
                      : <Route key={index} path={path} element={<Comp />} />
                )
              })
            }
          </Routes>
          {/* <Routes>
            <Route exact path="/" element={<HomeView/>} />
            <Route exact path="/account/signin" element={<SignInView/>} />
            <Route exact path="/account/signup" element={<SignUpView/>} />
            <Route
              exact
              path="/account/forgotpassword"
              element={<ForgotPasswordView/>}
            />
            <Route
              exact
              path="/account/update-password"
              element={<UpdatNewPassword/>}
            />
            <Route
              exact
              path="/account/otp-verification"
              element={<OtpVerification />}
            />
            
            <Route exact path="/account/user-profile" element={<ProfileView />} />
            <Route exact path="/account/profile" element={<MyProfileView/>} />
            <Route exact path="/account/orders" element={<OrdersView/>} />
            <Route exact path="/account/wishlist" element={<WishlistView/>} />
            <Route
              exact
              path="/account/notification"
              element={<NotificationView/>}
            />
            <Route exact path="/category" element={<ProductListView/>} />
            <Route exact path="/product/detail" element={<ProductDetailView/>} />
            <Route exact path="/star/zone" element={<StarZoneView/>} />
            <Route exact path="/cart" element={<CartView/>} />
            <Route exact path="/checkout" element={<CheckoutView />} />
            <Route exact path="/invoice" element={<InvoiceView />} />
            <Route exact path="/documentation" element={<DocumentationView/>} />
            <Route exact path="/contact-us" element={<ContactUsView/>} />
            <Route exact path="/support" element={<SupportView/>} />
            <Route exact path="/blog" element={<BlogView/>} />
            <Route exact path="/blog/detail" element={<BlogDetailView/>} />
            <Route exact path="/500" element={<InternalServerErrorView/>} />
            <Route path="*" element={<NotFoundView/>} />
          </Routes> */}
        </Suspense>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
