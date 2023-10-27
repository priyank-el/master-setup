import {
  register,
  loginUser
} from "./userController";
import commonController from "./../common/commonController";
import V from "./validation";
import Middlewares from "../../middlewares/validations";

export default [
  {
    path: "/register",
    method: "post",
    controller: register,
    // validation: V.registerValidation,
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
    // validation: V.loginValidation,
    isPublic: true,
  },
  // {
  //   path: "/forgetPassword",
  //   method: "post",
  //   controller: UserController.forgetPassword,
  //   validation: V.forgetPwdValidation,
  //   isPublic: true,
  // },
  // {
  //   path: "/resetPassword",
  //   method: "post",
  //   controller: UserController.resetPassword,
  //   validation: V.resetPwdValidation,
  //   authMiddleware: Middlewares.verifyAuthToken,
  // },
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
  // {
  //   path: "/updateProfile",
  //   method: "post",
  //   controller: UserController.updateProfile,
  //   validation: V.updateProfile,
  //   isPublic: false,
  // },
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
  // {
  //   path: "/web/uploadImage/:type",
  //   method: "post",
  //   controller: commonController.uploadImage,
  //   isPublic: true,
  //   // isEncrypt: false
  // },
];
