import commonUtils from "../../utils/commonUtils";
import commonController from "../common/commonController";
import {
  register,
  loginUser,
  forgotUserPassword,
  resetPassword,
  updateUserProfile
} from "./userController";
import V from "./validation";

export default [
  {
    path: "/register",
    method: "post",
    controller: register,
    validation: V.registerValidation,
    isPublic: true,
  },
  // {
  //   path: "/otp/verify",
  //   method: "post",
  //   controller: UserController.verifyOtp,
  //   authMiddleware: Middlewares.verifyAuthToken,
  // },
  // {
  //   path: "/otp/resend",
  //   method: "get",
  //   controller: UserController.resendOtp,
  //   authMiddleware: Middlewares.verifyAuthToken,
  // },
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
  // {
  //   path: "/profile",
  //   method: "get",
  //   controller: UserController.getProfile,
  //   isPublic: false,
  // },
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
