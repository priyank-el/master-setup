import { Request, Response } from "express";

import commonUtils from "../../utils/commonUtils";

import Admin from '../admin/models/adminModel'
import * as bcrypt from 'bcrypt'
import * as Jwt from 'jsonwebtoken'
import config from 'config'
import { sendVerifyEmail } from "../user/userController";
import fs from 'fs'
import path from 'path'
import Category from "./models/categoryModel";
import Brand from "./models/brandModel";

async function register(req: Request, res: Response) {

  const {
    name,
    email,
    password
  } = req.body

  try {
    const hasedPassword = await bcrypt.hash(password, config.get("saltRounds"))

    const currentDate = new Date().toLocaleDateString();

    let otp = commonUtils.generateOtpCode();
    await sendVerifyEmail(name, email, `otp is ${otp}`, otp, currentDate)

    const admin = await Admin.create({
      name,
      email,
      password: hasedPassword,
      otp
    })

    if (!admin) throw "some error occured"
    commonUtils.sendSuccess(req, res, { message: "admin registered", admin_id: admin._id }, 201)
  } catch (error) {
    commonUtils.sendError(req, res, error, 400)
  }
}

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const admin = await Admin.findOne({ email })
    if(!admin) throw "Email not found plsese do register first"
    const isEqualPassword = await bcrypt.compare(password, admin.password)

    if (!isEqualPassword) throw "password miss match"
    const payload = { id: admin._id }

    const token = await Jwt.sign(payload, config.get("JWT_ACCESS_SECRET"))

    commonUtils.sendSuccess(req, res, { admin_id: admin._id, token }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 401)
  }
}

export const forgotPassword = async (req: Request, res: Response) => {

  const email = req.body.email
  const type = req.body.type
  console.log("body is -> ", req.body);
  if (type === 1) {
    try {
      const admin = await Admin.findOne({ email })
      if (!admin) throw "please do register first"
      const currentDate = new Date().toLocaleDateString();

      let otp = commonUtils.generateOtpCode();
      await sendVerifyEmail(admin.name, email, `otp is ${otp}`, otp, currentDate)
      await Admin.findOneAndUpdate({ email }, {
        otp
      })
      commonUtils.sendSuccess(req, res, { message: "otp sended" }, 200)
    } catch (error) {
      console.log(error)
      commonUtils.sendError(req, res, { error }, 401)
    }
  } else {
    try {
      const otp = req.body.otp

      const admin = await Admin.findOne({ email })
      if (otp !== admin.otp) throw "otp miss match"
      commonUtils.sendSuccess(req, res, { message: "otp verified" }, 200)
    } catch (error) {
      commonUtils.sendError(req, res, { error }, 401)
    }
  }
}

export const resetAdminPassword = async (req: Request, res: Response) => {

  const email = req.body.email
  const newPassword = req.body.newPassword

  try {
    const hasedPassword = await bcrypt.hash(newPassword, config.get("saltRounds"))

    await Admin.findOneAndUpdate({ email }, {
      password: hasedPassword
    })
    commonUtils.sendSuccess(req, res, { message: "password reseted" }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 400)
  }
}

export const updateAdminProfile = async (req: Request, res: Response) => {
  const id = req.app.locals.user._id
  console.log("user is ->", id);

  const {
    name,
    email,
    mobile,
    address,
    image
  } = req.body

  console.log("image is ->", image);
  if (image === (null || undefined)) {
    console.log(image);
  } else {
    const admin = await Admin.findById(id)
    if (admin.profile) {
      const image = admin.profile;
      fs.unlink(path.join(__dirname, `../../../uploads/admin/${image}`), (e) => {
        if (e) {
          console.log(e);
        } else {
          console.log("file deleted success..");
        }
      })
    }
  }

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(id, {
      name,
      email,
      mobile,
      address,
      profile: image
    })

    if (!updatedAdmin) "something went wrong"
    commonUtils.sendSuccess(req, res, { message: "admin updated" }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 400)
  }

}

export const getProfile = async (req: Request, res: Response) => {
  const id = req.app.locals.user._id
  console.log(id);
  try {
    const admin = await Admin.findById(id)
    commonUtils.sendSuccess(req, res, admin, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 401)
  }
}

const updatePassword = async (req: Request, res: Response) => {
  const {
    oldPass, newPass
  } = req.body
  const _id = req.app.locals.user._id

  try {
    const hasedNewPassword = await bcrypt.hash(newPass, config.get("saltRounds"))

    const admin = await Admin.findById(_id)
    const isEqual = await bcrypt.compare(oldPass, admin.password)

    if (!isEqual) throw "password miss match"
    await Admin.findByIdAndUpdate(_id, {
      password: hasedNewPassword
    })
    commonUtils.sendSuccess(req, res, { message: "password updated" }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 400)
  }
}

// async function refreshToken(req: Request, res: Response) {
//   try {
//     let payload: AdminTokenPayload = res.locals.payload;
//     const tokenData = await Auth.generateAdminAccessToken(payload);
//     res.cookie("accessToken", tokenData.accessToken, {
//       maxAge: 900000,
//       httpOnly: true,
//     });
//     res.cookie("refreshToken", tokenData.refreshToken, {
//       maxAge: 900000,
//       httpOnly: true,
//     });
//     return commonUtils.sendSuccess(req, res, tokenData);
//   } catch (err: any) {
//     console.log(err);
//     return commonUtils.sendError(req, res, {
//       error: AppStrings.SOMETHING_WENT_WRONG,
//     });
//   }
// }

// const getProfile = async (req: any, res: Response) => {
//   const payload: AdminTokenPayload = res.locals.payload;
//   const admin = await Admin.findById(payload.userId).select(
//     "_id name email mobile status google2fa_status"
//   );
//   return commonUtils.sendSuccess(req, res, admin);
// };

// const updateProfile = async (req: any, res: Response) => {
//   const payload: AdminTokenPayload = res.locals.payload;
//   const admin = await Admin.findById(payload.userId).exec();
//   if (!admin)
//     return commonUtils.sendError(
//       req,
//       res,
//       { message: AppStrings.ADMIN_NOT_FOUND },
//       409
//     );

//   const name = req.body?.name || admin.name;
//   const email = req.body?.email || admin.email;
//   const mobile = req.body?.mobile || admin.mobile;
//   admin.name = name;
//   admin.email = email;
//   admin.mobile = mobile;

//   await admin.save();
//   await admin.updateOne({ name: name, email: email, mobile: mobile }).exec();
//   return commonUtils.sendSuccess(
//     req,
//     res,
//     { message: AppStrings.PROFILE_UPDATED },
//     200
//   );
// };

// const changePassword = async (req: any, res: Response) => {
//   const payload: AdminTokenPayload = res.locals.payload;

//   const old_password = req.body.old_password;
//   const new_password = req.body.new_password;

//   const admin = await Admin.findById(payload.userId).exec();

//   if (!admin)
//     return commonUtils.sendError(
//       req,
//       res,
//       { message: AppStrings.USER_NOT_FOUND },
//       409
//     );

//   const valid_password = await bcrypt.compare(old_password, admin.password);
//   if (!valid_password)
//     return commonUtils.sendError(
//       req,
//       res,
//       { message: AppStrings.OLD_PASSWORD_INVALID },
//       409
//     );

//   const salt = await bcrypt.genSalt(10);
//   admin.password = await bcrypt.hash(new_password, salt);
//   await admin.updateOne({ password: admin.password }).exec();

//   return commonUtils.sendSuccess(
//     req,
//     res,
//     { message: AppStrings.PASSWORD_CHANGED },
//     200
//   );
// };

// const userList = async (req: any, res: Response) => {
//   const user = await User.find({
//     $or: [
//       { type: 2, makeAdmin: true }, // Users with type equal to 1
//       { type: 4, makeAdmin: true }, // Users with type equal to 3 and makeAdmin equal to true
//     ],
//   }).select('_id firstName lastName companyName dotNumber mcNumber email mobile alternativeMobile type createdAt').sort({ createdAt: 'desc' });
//   return commonUtils.sendSuccess(req, res, user);
// }

// const allUserList = async (req: any, res: Response) => {
//   const user = await User.find().select(
//     "_id firstName lastName companyName email mobile type"
//   );
//   return commonUtils.sendSuccess(req, res, user);
// };

const createCategory = async (req: Request, res: Response) => {
  const name = req.body.name

  try {
    const category = await Category.create({
      categoryName:name
    })
  
    if(!category){
      throw 'category not created'
    }
    commonUtils.sendSuccess(req,res,{message:'category created'},201)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
    if(categories.length === 0){
      throw 'no category found'
    }
    commonUtils.sendSuccess(req,res,categories,200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

const updateCategory = async (req: Request, res: Response) => {
  const {id,name} = req.body
  try {
    const category = await Category.findByIdAndUpdate(id,{
      categoryName:name
    })
    if(!category){
      throw 'category not updated'
    }
    commonUtils.sendSuccess(req,res,{message:'category updated'},200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

const deleteCategory = async (req: Request, res: Response) => {
  const _id = req.body.id
  try {
    const category = await Category.findByIdAndDelete(_id)
    if(!category){
      throw 'category not deleted'
    }
    commonUtils.sendSuccess(req,res,{message:'category deleted.'},200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

// BRAND SIDE:-
const createBrand = async (req: Request, res: Response) => {
  const { category_id,brandName} = req.body

  try {
    const brand = await Brand.create({
      category_Id:category_id,
      brandName
    })
  
    if(!brand){
      throw 'brand not created.'
    }
    commonUtils.sendSuccess(req,res,{message:'brand created.'},201)
  } catch (error) {
    commonUtils.sendError(req,res,{error},401)
  }
}

const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.aggregate([
      {
        $lookup:{
          from:'categories',
          localField:'category_Id',
          foreignField:'_id',
          as:'category'
        }
      },
      {
        $unwind:"$category"
      },
      {
        $project:{
          '_id':1,
          'brandName':1,
          'status':1,
          'category.categoryName':1
        }
      }
    ])
    if(brands.length === 0){
      throw "brands not found"
    }
    commonUtils.sendSuccess(req,res,brands,200)
  } catch (error) {
    commonUtils.sendError(req,res,{error},401)
  }

}

const deleteBrand = async (req: Request, res: Response) => {
  const _id = req.body.id
  try {
    const brand = await Brand.findByIdAndDelete(_id)
    if(!brand){
      throw 'brand not deleted'
    }
    commonUtils.sendSuccess(req,res,{message:'brand deleted successfully.'},200)
  } catch (error) {
    commonUtils.sendError(req,res,{error},401)
  }
}

export default {
  register,
  login,
  forgotPassword,
  resetAdminPassword,
  updateAdminProfile,
  getProfile,
  updatePassword,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,

  createBrand,
  getAllBrands,
  deleteBrand,
  // logout,
  // refreshToken,
  // updateProfile,
  // changePassword,
  // userList,
  // allUserList,
};
