import { Request, Response } from "express";
import commonUtils from "../../utils/commonUtils";
import { AppStrings } from "../../utils/appStrings";
import Auth from "../../auth";
import eventEmitter from "../../utils/event";
import {
  LoginRequestPayload,
  OtpRequestPayload,
  RegisterRequestPayload,
  ResetPasswordRequestPayload,
  UserTokenPayload,
  UserTokenRole,
} from "../../auth/models";
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
const config = require("config");
const LoginDetail = require("./models/loginDetailModel");

async function login(req: Request, res: Response) {
  try {
    let userData = await User.findOne({ email: req.body.email });
    if (userData == null) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.EMAIL_NOT_REG },
        409
      );
    }
    if (userData.type == 3 || userData.type == 4) {
      if (userData.isVerified == 0 || userData.isVerified == 2) {
        return commonUtils.sendError(
          req,
          res,
          { message: AppStrings.USER_NOT_VERIFIED },
          409
        );
      }
    }

    if (userData.activeStatus == 0) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.USER_ACCOUNT },
        409
      );
    }
    if (!userData.password) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.ACCOUNT_APPROVED },
        409
      );
    }
    const valid_password = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!valid_password) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.INVALID_PASSWORD },
        409
      );
    }

    if (userData.isApprove == 0) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.ACCOUNT_NOT_APPROVED },
        409
      );
    }
    const currentDate = new Date().toLocaleDateString();
    let otp = commonUtils.generateOtpCode();
    // send otp in mail
    const host = req.headers.host;
    const userName = userData.firstName + " " + userData.lastName;
    const subject = `Your Verification Code for Know Your Trucker - ${otp}`;
    await sendVerifyEmail(
      userName,
      userData.email,
      subject,
      host,
      otp,
      userData.mobile,
      currentDate
    );
    const tokenData = await Auth.login(userData._id, req.body.pushToken, otp);

    return commonUtils.sendSuccess(
      req,
      res,
      { token: tokenData.accessToken },
      200
    );
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function logout(req: Request, res: Response) {
  try {
    let userId = res.locals.payload.userId;

    const loginDetailEntry = await LoginDetail.findOne({ userId: userId });

    await Auth.deleteAccessToken(userId);

    if (loginDetailEntry) {
      loginDetailEntry.toTime = new Date().toLocaleTimeString(); // Set current time as the new toTime
      loginDetailEntry.loginStatus = 0; // Set loginStatus to 0 (user logged out)

      const previousLoginSession =
        loginDetailEntry.loginSessions[
          loginDetailEntry.loginSessions.length - 1
        ];
      if (previousLoginSession) {
        previousLoginSession.toTime = new Date().toLocaleTimeString();
        previousLoginSession.loginStatus = 0;
      }
      await loginDetailEntry.save();
    } else {
      const loginDetail = new LoginDetail({
        userId: userId,
        activeStatus: 1,
        loginSessions: [
          {
            date: new Date(),
            fromTime: new Date().toLocaleTimeString(),
            toTime: new Date().toLocaleTimeString(),
            loginStatus: 0, // Set loginStatus to 0 (user logged out)
          },
        ],
      });

      await loginDetail.save();
    }

    return commonUtils.sendSuccess(req, res, {});
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function refreshToken(req: Request, res: Response) {
  try {
    let payload: UserTokenPayload = res.locals.payload;
    const tokenData = await Auth.generateUserAccessToken(payload);
    res.cookie("accessToken", tokenData.accessToken, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie("refreshToken", tokenData.refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });
    return commonUtils.sendSuccess(req, res, tokenData);
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function register(req: Request, res: Response) {
  const userExit = await User.findOne({ email: req.body.email });
  if (userExit) {
    return commonUtils.sendError(
      req,
      res,
      {
        code: "email_already_taken",
        message: AppStrings.EMAIL_ALREDY_USE,
      },
      409
    );
  }
  let user_data: any = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    companyName: req.body.companyName,
    mcNumber: req.body.mcNumber,
    dotNumber: req.body.dotNumber,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    ext: req.body.ext,
    type: req.body.type,
    isApprove: req.body.type == 1 ? 0 : 1,
    makeAdmin: true,
  };
  const user = user_data;
  try {
    let otp = commonUtils.generateOtpCode();
    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const tokenData = await Auth.register(user, otp);
    // send otp in mail
    const currentDate = new Date().toLocaleDateString();
    const host = req.headers.host;
    const userName = user.firstName + " " + user.lastName;
    const subject = `Your Verification Code for Know Your Trucker - ${otp}`;
    await sendVerifyEmail(
      userName,
      user.email,
      subject,
      host,
      otp,
      user.mobile,
      currentDate
    );
    return commonUtils.sendSuccess(
      req,
      res,
      { token: tokenData.accessToken },
      200
    );
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

const sendVerifyEmail = async (
  username: string,
  credential: any,
  subject: any,
  host: any,
  otp: any,
  mobile: string,
  currentDate: any
) => {
  try {
    eventEmitter.emit("send_email_otp", {
      username: username,
      to: credential,
      subject: subject,
      data: {
        otp: otp,
        message: "Your email has been verified!",
      },
      sender: config.MAIL_SENDER_NO_REPLY,
      host: host,
      mobile: mobile,
      currentDate: currentDate,
    });
  } catch (err: any) {
    console.log("send verify otp : ", err);
  }
};

async function forgetPassword(req: Request, res: Response) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.EMAIL_NOT_REG },
        409
      );
    }

    if (user.type == 3 || user.type == 4) {
      if (user.isVerified == 0 || user.isVerified == 2) {
        return commonUtils.sendError(
          req,
          res,
          { message: AppStrings.USER_NOT_VERIFIED },
          409
        );
      }
    }

    if (user.activeStatus == 0) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.USER_ACCOUNT },
        409
      );
    }

    let otp = commonUtils.generateOtpCode();
    const tokenData = await Auth.forgetPassword(user._id, otp);
    // send otp in mail
    const currentDate = new Date().toLocaleDateString();
    const host = req.headers.host;
    const userName = user.firstName + " " + user.lastName;
    const subject = `Your Verification Code for Know Your Trucker - ${otp}`;
    await sendVerifyEmail(
      userName,
      user.email,
      subject,
      host,
      otp,
      user.mobile,
      currentDate
    );
    return commonUtils.sendSuccess(
      req,
      res,
      { token: tokenData.accessToken },
      200
    );
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function verifyOtp(req: Request, res: Response) {
  try {
    const { otp } = req.body;
    let payloadData: OtpRequestPayload = res.locals.payload?.data;
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    if (payloadData.verify == true) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.OTP_ALREADY_VERIFIED },
        409
      );
    }

    if (payloadData.otp.toString() != otp.toString()) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.OTP_NOT_MATCH },
        409
      );
    }

    switch (payloadData.type) {
      case UserTokenRole.loginToken:
        await Auth.removeDataUsingPayload(res.locals.payload.payload);
        let loginRequestPayload: LoginRequestPayload = res.locals.payload?.data;
        let userId = loginRequestPayload.userId;
        let loginUserData = await User.findOne({ _id: userId });

        const tokenData = await Auth.generateUserAccessToken({
          userId: loginUserData._id,
          createdAt: loginUserData.createdAt,
          userType: loginUserData.type,
        });
        res.cookie("accessToken", tokenData.accessToken, {
          maxAge: 900000,
          httpOnly: true,
        });
        res.cookie("refreshToken", tokenData.refreshToken, {
          maxAge: 900000,
          httpOnly: true,
        });
        await User.updateOne(
          { _id: userId },
          { $set: { pushToken: loginRequestPayload.pushToken } }
        );
        const user = {
          firstName: loginUserData.firstName,
          lastName: loginUserData.lastName,
          companyName: loginUserData.companyName,
          mcNumber: loginUserData.mcNumber,
          dotNumber: loginUserData.dotNumber,
          email: loginUserData.email,
          mobile: loginUserData.mobile,
          alternativeMobile: loginUserData.alternativeMobile,
          ext: loginUserData.ext,
          type: loginUserData.type,
          mainUserId: loginUserData.mainUserId,
          _id: loginUserData._id,
        };

        const loginDetailEntry = await LoginDetail.findOne({
          userId: loginUserData._id,
          date: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lt: new Date().setHours(23, 59, 59, 999),
          },
        });

        const currentDateTime = new Date().toLocaleTimeString();
        if (loginDetailEntry) {
          if (!loginDetailEntry.loginSessions) {
            loginDetailEntry.loginSessions = [];
          }

          const activeLoginSession = loginDetailEntry.loginSessions.find(
            (session: any) =>
              session.date &&
              session.date.getTime() ===
                new Date().setHours(0, 0, 0, 0).valueOf() &&
              session.loginStatus === 1
          );

          loginDetailEntry.toTime = new Date().toLocaleTimeString(); // Set current time as the new toTime
          loginDetailEntry.loginStatus = 0; // Set loginStatus to 0 (user logged out)

          const previousLoginSession =
            loginDetailEntry.loginSessions[
              loginDetailEntry.loginSessions.length - 1
            ];
          if (previousLoginSession) {
            previousLoginSession.toTime = new Date().toLocaleTimeString();
            previousLoginSession.loginStatus = 0;
            previousLoginSession.ipAddress = ip;
          }

          if (activeLoginSession) {
            const previousLoginSession =
              loginDetailEntry.loginSessions[
                loginDetailEntry.loginSessions.length - 2
              ]; // Access the second-to-last object in the array

            if (previousLoginSession) {
              previousLoginSession.toTime = currentDateTime;
            }

            activeLoginSession.toTime = currentDateTime;
          } else {
            loginDetailEntry.loginSessions.push({
              date: new Date(),
              fromTime: currentDateTime,
              toTime: currentDateTime,
              loginStatus: 1,
              ipAddress: ip,
            });
          }
          await loginDetailEntry.save();
        } else {
          const loginDetail = new LoginDetail({
            userId: loginUserData._id,
            activeStatus: 1, // Set activeStatus to 1 (user logged in)
            loginSessions: [
              {
                date: new Date(),
                fromTime: currentDateTime,
                toTime: currentDateTime,
                loginStatus: 1,
                ipAddress: ip,
              },
            ],
          });
          await loginDetail.save();
        }

        const responseData = {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          userData: user,
        };
        return commonUtils.sendSuccess(req, res, responseData, 200);
      case UserTokenRole.registerToken:
        await Auth.removeDataUsingPayload(res.locals.payload.payload);
        let registerRequestPayload: RegisterRequestPayload =
          res.locals.payload?.data;
        const userObject = registerRequestPayload.userData;
        const userData = new User(userObject);
        await userData.save();
        break;
      case UserTokenRole.resetPasswordToken:
        await Auth.updateDataUsingPayload(res.locals.payload.payload, {
          verify: true,
        });
        break;
    }

    return commonUtils.sendSuccess(
      req,
      res,
      { message: AppStrings.VERIFY_SUCCESSFULL },
      200
    );
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function resendOtp(req: Request, res: Response) {
  try {
    let payloadData = res.locals.payload?.data;

    let otp = commonUtils.generateOtpCode();
    await Auth.updateDataUsingPayload(res.locals.payload.payload, {
      createdAt: Date.now(),
      otp: otp,
    });

    const currentDate = new Date().toLocaleDateString();

    switch (payloadData.type) {
      case UserTokenRole.loginToken:
        let loginRequestPayload: LoginRequestPayload = res.locals.payload?.data;
        break;
      case UserTokenRole.registerToken:
        let registerRequestPayload: RegisterRequestPayload =
          res.locals.payload?.data;
        // send otp in mail
        const _host = req.headers.host;
        const user = registerRequestPayload?.userData;
        const user_name = user.firstName + " " + user.lastName;
        const sub = "Dear Customer, Your Trucker Login otp is " + otp + ".";
        await sendVerifyEmail(
          user_name,
          user.email,
          sub,
          _host,
          otp,
          user.mobile,
          currentDate
        );
        break;
      case UserTokenRole.resetPasswordToken:
        // send otp in mail
        const userID = res.locals.payload?.data.userId;
        let userData = await User.findOne({ _id: userID });
        const host = req.headers.host;
        const userName = userData.firstName + " " + userData.lastName;
        const subject = `Your Verification Code for Know Your Trucker - ${otp}`;
        await sendVerifyEmail(
          userName,
          userData.email,
          subject,
          host,
          otp,
          user.mobile,
          currentDate
        );
        break;
    }
    return commonUtils.sendSuccess(
      req,
      res,
      { message: AppStrings.SUCCESS },
      200
    );
  } catch (err: any) {
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    const { password } = req.body;
    let payloadData: ResetPasswordRequestPayload = res.locals.payload?.data;
    if (payloadData?.verify != true) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.OTP_NOT_VERIFY },
        409
      );
    }

    const UserExist = await User.findOne({ _id: payloadData?.userId });
    const valid_password = await bcrypt.compare(password, UserExist.password);
    if (!UserExist) {
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.USER_NOT_FOUND },
        409
      );
    }

    if (valid_password) {
      return commonUtils.sendError(req, res, {
        message: AppStrings.NEW_PASSWORD_DIFFERENT,
      });
    }

    const salt = await bcrypt.genSalt(10);
    let hash_password = await bcrypt.hash(password, salt);
    await User.updateOne(
      { _id: payloadData.userId },
      { $set: { password: hash_password } }
    );

    await Auth.removeDataUsingPayload(res.locals.payload.payload);
    return commonUtils.sendSuccess(
      req,
      res,
      { message: AppStrings.PASSWORD_CHANGE_SUUCESSFULL },
      200
    );
  } catch (err: any) {
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function changePassword(req: Request, res: Response) {
  try {
    const payload: UserTokenPayload = res.locals.payload;
    const { old_password, new_password } = req.body;

    const user = await User.findById(payload.userId);
    if (!user)
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.USER_NOT_FOUND },
        409
      );

    const valid_password = await bcrypt.compare(old_password, user.password);
    if (!valid_password) {
      return commonUtils.sendError(req, res, {
        message: AppStrings.CURRENT_PASSWORD_WRONG,
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.save();
    return commonUtils.sendSuccess(
      req,
      res,
      { message: AppStrings.PASSWORD_CHANGED },
      200
    );
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function getProfile(req: any, res: Response) {
  try {
    const payload: UserTokenPayload = res.locals.payload;
    const user = await User.findById(payload.userId).select(
      "firstName lastName email mobile alternativeMobile companyName mcNumber type ext"
    );
    if (!user)
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.USER_NOT_FOUND },
        409
      );
    return commonUtils.sendSuccess(req, res, user, 200);
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function updateProfile(req: Request, res: Response) {
  try {
    const payload: UserTokenPayload = res.locals.payload;
    const { firstName, lastName, alternativeMobile, ext } = req.body;
    const user = await User.findOne({ _id: payload.userId });
    if (!user)
      return commonUtils.sendError(
        req,
        res,
        { message: AppStrings.USER_NOT_FOUND },
        409
      );

    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.ext = ext;
    user.alternativeMobile = alternativeMobile;
    await user.save();
    const user_ = await User.findById(user._id).select(
      "firstName lastName email mobile alternativeMobile companyName mcNumber type ext dotNumber"
    );
    return commonUtils.sendSuccess(req, res, user_, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

export default {
  register,
  login,
  logout,
  refreshToken,
  resendOtp,
  verifyOtp,
  forgetPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
};
