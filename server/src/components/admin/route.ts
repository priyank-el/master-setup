import adminController from "./adminController";

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
  // {
  //   path: "/profile",
  //   method: "get",
  //   controller: adminController.getProfile,
  // },
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
];
    