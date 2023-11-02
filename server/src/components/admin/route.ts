import commonController from "../common/commonController";
import adminController from "./adminController";
import Middlewares from '../../middlewares/validations/index'

export default [
  {
    path: "/register",
    method: "post",
    controller: adminController.register,
    // validation: V.registerValidation,
    isPublic: true,
  },
  {
    path: "/login",
    method: "post",
    controller: adminController.login,
    isPublic: true,
  },
  {
    path: "/forgot-password",
    method: "post",
    controller: adminController.forgotPassword,
    isPublic: true,
  },
  {
    path: "/reset-password",
    method: "put",
    controller: adminController.resetAdminPassword,
    isPublic: true,
  },
  {
    path: "/update-profile",
    method: "put",
    controller: adminController.updateAdminProfile,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic: false,
  },

  // {
  //   path: "/logout",
  //   method: "patch",
  //   controller: adminController.logout,
  //   isEncrypt: false,
  // },
  // {
  //   path: "/refreshToken",
  //   method: "get",
  //   controller: adminController.refreshToken,
  //   authMiddleware: Middlewares.verifyAdminAccessToken,
  // },
  // {
  //   path: "/updateprofile",
  //   method: "patch",
  //   controller: adminController.updateProfile,
  //   validation: V.profileValidation,
  // },
  {
    path: "/profile",
    method: "get",
    controller: adminController.getProfile,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/update-pass",
    method: "put",
    controller: adminController.updatePassword,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  // {
  //   path: "/changePassword",
  //   method: "post",
  //   controller: adminController.changePassword,
  //   validation: V.changePasswordValidation,
  //   isEncrypt: false,
  //   // isPublic: true
  // },
  // {
  //   path: "/encryption",
  //   method: "post",
  //   controller: encryptedData.encryptedDataRequest,
  //   isEncrypt: false,
  //   isPublic: true,
  // },
  // {
  //   path: "/decryption",
  //   method: "post",
  //   controller: decryptData.DecryptedDataRequest,
  //   isEncrypt: false,
  //   isPublic: true,
  // },
  // {
  //   path: "/userList",
  //   method: "get",
  //   controller: adminController.userList,
  //   isPublic: true,
  // },
  // {
  //   path: "/allUserList",
  //   method: "get",
  //   controller: adminController.allUserList,
  //   isPublic: true,
  // },
  {
    path: "/web/uploadImage/:type",
    method: "post",
    controller: commonController.uploadImage,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic: false,
    // isEncrypt: false
  },
];
    