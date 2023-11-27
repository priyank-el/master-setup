const config = require("config")

import { Request, Response } from "express"
import commonUtils from "../../utils/commonUtils"
import { AppStrings } from "../../utils/appStrings"
import User from "./models/userModel"
import * as bcrypt from 'bcrypt'
import * as Jwt from 'jsonwebtoken'
import eventEmitter from '../../utils/event'
import mongoose from "mongoose"
import fs from 'fs'
import path from "path"
import Product from "../admin/models/productModel"
import Cart from "./models/cartModel"

export const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password
    } = req.body

    const hasedPassword = await bcrypt.hash(password, config.get("saltRounds"))
    const currentDate = new Date().toLocaleDateString();

    let otp = commonUtils.generateOtpCode();
    await sendVerifyEmail(username, email, `otp is ${otp}`, otp, currentDate)

    await User.create({
      username,
      email,
      password: hasedPassword,
      otp
    })


    commonUtils.sendSuccess(req, res, { message: "user created" }, 201)
  } catch (err: any) {
    console.log("error", err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) throw "register first"
    if (user.isVerified === 0) throw "verify otp first"

    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) throw "password miss match"

    const payload = { user }
    const token = await Jwt.sign(payload, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") })

    commonUtils.sendSuccess(req, res, { message: "user login", token }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 400)
  }
}

export const forgotUserPassword = async (req: Request, res: Response) => {
  const { email, type, otp } = req.body
  try {
    const isUser = await User.findOne({ email })
    if (!isUser) throw "user not found do register first"

    const currentDate = new Date().toLocaleDateString();

    if (type == 1) {
      let otp = commonUtils.generateOtpCode()
      await sendVerifyEmail(isUser.username, email, `otp is ${otp}`, otp, currentDate)
      await User.findOneAndUpdate({ email }, {
        otp
      })
      commonUtils.sendSuccess(req, res, { message: "otp sended" }, 200)
    }
    else {
      if (otp !== isUser.otp) throw "otp not valid"
      const message = { message: "otp verified" }
      commonUtils.sendSuccess(req, res, message, 200)
    }
  } catch (error) {
    console.log("error", error);
    commonUtils.sendError(req, res, { error }, 400)
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const hasedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate({ email }, {
      password: hasedPassword
    })
    const message = { message: "password updated" }
    commonUtils.sendSuccess(req, res, message, 200)
  } catch (error) {
    commonUtils.sendError(req, res, error, 401)
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  const {
    username, email, firstName, lastName, mobile, image
  } = req.body
  const userId: any = req.query.userId;

  const user = await User.findById(userId)
        if (user?.image) {
            const image = user.image;
            // console.log(path.join(__dirname,'../../../uploads/user/'));
            fs.unlink(path.join(__dirname,`../../../uploads/user/${image}`), (e) => {
                if (e) {
                    console.log(e);
                } else {
                    console.log("file deleted success..");
                }
            })  
        }

  try {
    await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {
      username,
      email,
      firstName,
      lastName,
      mobile,
      image
    })

    commonUtils.sendSuccess(req, res, { message: "user profile updated" }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, error, 401)
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const {
      otp, email
    } = req.body

    const isUser = await User.findOne({ email })

    if (isUser.otp !== otp) throw "otp miss match"
    await User.findOneAndUpdate({ email }, {
      isVerified: 1
    })
    commonUtils.sendSuccess(req, res, { message: "otp verified" }, 200)
  } catch (error: any) {
    console.log(error)
    commonUtils.sendError(req, res, error, 401)
  }

}

export const resendOtp = async (req: Request, res: Response) => {
  const email = req.body.email;
  try {

    const user = await User.findOne({ email })
    if (!user) throw "user not found please do register first"
    const currentDate = new Date().toLocaleDateString();

    let otp = commonUtils.generateOtpCode();
    await sendVerifyEmail(user.username, email, `otp is ${otp}`, otp, currentDate)

    commonUtils.sendSuccess(req, res, { message: "otp sended" }, 200)
  } catch (error) {
    console.log(error)
    commonUtils.sendError(req, res, { error }, 401)
  }
}

export const getProfile = async (req: Request, res: Response) => {
  const userData = req.app.locals.user.user
  try {
    const user = await User.findById(userData._id)

    if (!user) throw "user not found"
    commonUtils.sendSuccess(req, res, user, 200)
  } catch (error) {
    commonUtils.sendError(req, res, { error }, 400)
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("come here");
    const users = await User.find()
    commonUtils.sendSuccess(req,res,users,200)
  } catch (error) {
    console.log(error);
    commonUtils.sendError(req,res,error,401)
  }
}

export const allProducts = async (req: Request, res: Response) => {
  try {
    const value = req.query.value
    const serchValue = req.query.value
      ? {
        $match: {
          productName: { $regex: value, $options: 'i' }
        }
      }
      : { $match: {} }
    const products = await Product.aggregate([
      serchValue
    ])
    commonUtils.sendSuccess(req,res,products,200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

// CART :-

export const addToCart = async (req: Request, res: Response) => {
  const {productId} = req.body
  const {user}  = req.app.locals.user

  try {
    await Cart.create({
      userId:user._id,
      productId
    })
  
    commonUtils.sendSuccess(req,res,{message:'product added in cart.'},201)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

export const fetchAllCartProducts = async (req: Request, res: Response) => {
  const {user} = req.app.locals.user
  const userId = new mongoose.Types.ObjectId(user._id)
  try {
    const products = await Cart.aggregate([
      {
        $match:{ userId }
      },
      {
        $lookup:{
          from:'products',
          localField:'productId',
          foreignField:'_id',
          as:'product'
        }
      },
      {
        $unwind:{
          path:'$product',
          preserveNullAndEmptyArrays:true
        }
      },
      {
        $project:{
          'productId':0,
          'createdAt':0,
          'updatedAt':0,
          '__v':0,
          'product.__v':0
        }
      }
    ])
  
    commonUtils.sendSuccess(req,res,products,200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
}

export const addQuantityInCart = async (req: Request, res: Response) => {
  const { cartId, productId, currentQuantity } = req.body;

  try {
    const product = await Product.findById(productId)
    const isAvailable = currentQuantity < product.numberOfProducts 
  
    if(isAvailable){
      await Cart.findByIdAndUpdate(cartId,{
        numberOfProducts:currentQuantity + 1
      })
    }

    commonUtils.sendSuccess(req,res,{message:'add quantity'},200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
} 

export const removeQuantityInCart = async (req: Request, res: Response) => {
  const { cartId, currentQuantity } = req.body;

  try {  
      await Cart.findByIdAndUpdate(cartId,{
        numberOfProducts:currentQuantity - 1
      })

    commonUtils.sendSuccess(req,res,{message:'remove quantity'},200)
  } catch (error) {
    commonUtils.sendError(req,res,error,401)
  }
} 

export const sendVerifyEmail = async (
  username: string,
  to: any,
  content: string,
  otp: any,
  currentDate: any
) => {
  try {
    eventEmitter.emit("send_email_otp", {
      username: username,
      to: to,
      subject: "Verify mail",
      data: {
        otp: otp,
        message: content,
      },
      sender: config.get("MAIL_USER"),
      currentDate
    });
  } catch (err: any) {
    console.log("send verify otp : ", err);
  }
}
