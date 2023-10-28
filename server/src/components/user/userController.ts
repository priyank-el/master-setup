import { Request, Response } from "express"
import commonUtils from "../../utils/commonUtils"
import { AppStrings } from "../../utils/appStrings"
import User from "./models/userModel"
import * as bcrypt from 'bcrypt'
const config = require("config")
import eventEmitter from '../../utils/event'
import mongoose from "mongoose"

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

    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) throw "password miss match"
    commonUtils.sendSuccess(req, res, { message: "user login",user }, 200)
  } catch (error) {
    commonUtils.sendError(req, res, error, 400)
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
        isVerified: 0,
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
    commonUtils.sendSuccess(req,res,message,200)
} catch (error) {
    commonUtils.sendError(req,res,error,401)
}
}

export const updateUserProfile = async (req:Request,res:Response) => {
    const {
      username,email,firstName,lastName,mobile,image
    } = req.body
    const userId:any = req.query.userId
    console.log(req.body);
    try {
      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId),{
        username,
        email,
        firstName,
        lastName,
        mobile,
        image
      })
  
      commonUtils.sendSuccess(req,res,{message:"user profile updated"},200)
    } catch (error) {
      commonUtils.sendError(req,res,error,401)
    }
}

const sendVerifyEmail = async (
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
