import { Request, Response } from "express";

import commonUtils from "../../utils/commonUtils";

import Admin from '../admin/models/adminModel'
import * as bcrypt from 'bcrypt'
import * as Jwt from 'jsonwebtoken'
import config from 'config'

async function register(req: Request, res: Response) {
  
  const {
    name,
    email,
    password
  } = req.body

 try {
   const hasedPassword = await bcrypt.hash(password,config.get("saltRounds"))
   const admin = await Admin.create({
     name,
     email,
     password:hasedPassword
   })
   
   commonUtils.sendSuccess(req,res,{message:"admin registered",admin_id:admin._id},201)
 } catch (error) {
    console.log(error)
    commonUtils.sendError(req,res,error,400)
 }
}

const login = async ( req:Request,res:Response ) => {
  const {email,password} = req.body

  try {
    const admin = await Admin.findOne({email})
    const isEqualPassword = await bcrypt.compare(password,admin.password) 
  
    if(!isEqualPassword) throw "password miss match"
    const payload = {email}

    const token = await Jwt.sign(payload,config.get("JWT_ACCESS_SECRET"))
    
    commonUtils.sendSuccess(req,res,{admin_id:admin._id,token},200)
  } catch (error) {
    commonUtils.sendError(req,res,{error},401)
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

export default {
  register,
  login,
  // logout,
  // refreshToken,
  // getProfile,
  // updateProfile,
  // changePassword,
  // userList,
  // allUserList,
};
