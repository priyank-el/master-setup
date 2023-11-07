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
  // CATEGORY :-
  {
    path: "/add-category",
    method: "post",
    controller: adminController.createCategory,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/update-category",
    method: "put",
    controller: adminController.updateCategory,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/delete-category",
    method: "post",
    controller: adminController.deleteCategory,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/all-categories",
    method: "get",
    controller: adminController.getAllCategories,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false,
  },
  // BRAND :-
  {
    path: "/add-brand",
    method: "post",
    controller: adminController.createBrand,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/all-brands",
    method: "get",
    controller: adminController.getAllBrands,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/update-brand",
    method: "put",
    controller: adminController.updateBrandById,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/delete-brand",
    method: "post",
    controller: adminController.deleteBrand,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/fetch-brand-by-category",
    method: "get",
    controller: adminController.fetchBrandsByCategory,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },

  // PRODUCTS :-
  {
    path: "/all-products",
    method: "get",
    controller: adminController.fetchAllProducts,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/create-product",
    method: "post",
    controller: adminController.createProduct,
    authMiddleware:Middlewares.AdminJwtAuth,
    isPublic:false
  },
  {
    path: "/delete-product",
    method: "post",
    controller: adminController.deleteProductById,
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
    