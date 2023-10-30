import commonController from "../common/commonController";
import {
  register,
  loginUser,
  forgotUserPassword,
  resetPassword,
  updateUserProfile,
  verifyOtp,
  resendOtp,
  getProfile
} from "./userController";
import V from "./validation";
import Middlewares from '../../middlewares/validations'

export default [
  {
    path: "/register",
    method: "post",
    controller: register,
    validation: V.registerValidation,
    isPublic: true,
  },
  {
    path: "/otp-verification",
    method: "post",
    controller: verifyOtp,
    isPublic: true
    // authMiddleware: Middlewares.verifyAuthToken,
  },
  {
    path: "resend-otp",
    method: "post",
    isPublic: true,
    controller: resendOtp,
    // authMiddleware: Middlewares.verifyAuthToken,
  },
  {
    path: "/login",
    method: "post",
    controller: loginUser,
    validation: V.loginValidation,
    isPublic: true,
  },
  {
    path: "/forgetPassword",
    method: "post",
    controller: forgotUserPassword,
    // validation: V.forgetPwdValidation,
    isPublic: true,
  },
  {
    path: "/reset-password",
    method: "put",
    controller: resetPassword,
    // validation: V.resetPwdValidation,
    // authMiddleware: Middlewares.verifyAuthToken,
    isPublic: true
  },
  // {
  //   path: "/changePassword",
  //   method: "post",
  //   controller: UserController.changePassword,
  //   validation: V.changePwdValidation,
  //   isPublic: false,
  // },
  {
    path: "/user-profile",
    method: "get",
    controller: getProfile,
    isPublic: false,
    isEncrypt:false,
    authMiddleware: Middlewares.JwtAuth,
  },
  {
    path: "/update-profile",
    method: "post",
    controller: updateUserProfile,
    // validation: V.updateProfile,
    isPublic: true
  },
  // {
  //   path: "/logout",
  //   method: "patch",
  //   controller: UserController.logout,
  //   isEncrypt: false,
  // },
  // {
  //   path: "/refreshToken",
  //   method: "get",
  //   controller: UserController.refreshToken,
  //   authMiddleware: Middlewares.verifyRefreshToken,
  // },
  {
    path: "/web/uploadImage/:type",
    method: "post",
    controller: commonController.uploadImage,
    isPublic: true,
    // isEncrypt: false
  },
];
