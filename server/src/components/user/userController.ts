import { Request, Response } from "express"
import commonUtils from "../../utils/commonUtils"
import { AppStrings } from "../../utils/appStrings"
import User from "./models/userModel"
import * as bcrypt from 'bcrypt'
const config = require("config")
import eventEmitter from '../../utils/event'

export const register = async (req: Request, res: Response) => {
  try{
    const {
      username,
      email,
      password
    } = req.body

    const hasedPassword = await bcrypt.hash(password,config.get("saltRounds"))
    const currentDate = new Date().toLocaleDateString();

    let otp = commonUtils.generateOtpCode();
    await sendVerifyEmail(username,email,`otp is ${otp}`,otp,currentDate)

    await User.create({
      username,
      email,
      password:hasedPassword,
      otp
    })


    commonUtils.sendSuccess(req,res,{message:"user created"},201)
  } catch (err: any) {
    console.log("error",err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const {email,password} = req.body

 try {
   const user = await User.findOne({email})
 
   const isPassword = await bcrypt.compare(password,user.password)
   if(!isPassword) throw "password miss match"
    commonUtils.sendSuccess(req,res,{message:"user login"},200)
 } catch (error) {
  commonUtils.sendError(req,res,error,400)
 }
} 

export const forgotUserPassword = async (req: Request, res: Response) => {
  const email = req.body.email

  try {
    const isUser = await User.findOne({email})
    if(!isUser) throw "user not found do register first"

    const currentDate = new Date().toLocaleDateString();

    let otp = commonUtils.generateOtpCode();
    await sendVerifyEmail(isUser.username,email,`otp is ${otp}`,otp,currentDate)

    await User.findOneAndUpdate({email},{
      isVerified:0
    })

    commonUtils.sendSuccess(req,res,{message:"otp send on email"},200)
  } catch (error) {
    console.log("error",error);
    commonUtils.sendError(req,res,{error},400)
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
