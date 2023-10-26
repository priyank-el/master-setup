import { Request, Response } from "express";

import commonUtils from "../../utils/commonUtils";
import { AppStrings } from "../../utils/appStrings";
import Auth from "../../auth/index";
import { AdminTokenPayload } from "../../auth/models";
import { AdminRole } from "../../utils/enum";
import mongoose from "mongoose";

const bcrypt = require("bcryptjs");
const Admin = require("./models/adminModel");
const Role = require("./models/roleModel");
const Permission = require("./models/permissionModel");
const RoleHasPermission = require("./models/roleHasPermission");
const User = require("../user/models/userModel");
const AdminHistory = require("../user/models/adminHistory");

async function register(req: Request, res: Response) {
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    status: 1,
  });

  // hash password
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();
  return commonUtils.sendAdminSuccess(
    req,
    res,
    { message: "Admin Register successfully", id: admin._id },
    200
  );
}

async function login(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email)
    return commonUtils.sendAdminError(
      req,
      res,
      { message: AppStrings.EMAIL_REQUIRED },
      400
    );

  try {
    let find_filed;
    let message;
    if (email) {
      find_filed = { email: email };
      message = AppStrings.EMAIL_NOT_EXISTS;
    }

    const admin = await Admin.findOne(find_filed).lean();
    if (!admin)
      return commonUtils.sendAdminError(req, res, { message: message }, 409);

    if (admin.status == 0)
      return commonUtils.sendAdminError(
        req,
        res,
        { message: AppStrings.ACCOUNT_INACTIVE },
        409
      );

    const valid_password = await bcrypt.compare(password, admin.password);
    if (!valid_password) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return commonUtils.sendAdminError(
        req,
        res,
        { message: AppStrings.INVALID_PASSWORD },
        409
      );
    }

    const { accessToken, refreshToken } = await Auth.generateAdminAccessToken({
      userId: admin._id,
      createdAt: admin.createdAt,
      adminRole: AdminRole.SUPER_ADMIN,
    });
    await Admin.findByIdAndUpdate(admin._id, {
      $set: { lastLogin: new Date() },
    }).exec();
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });

    const role = await Role.findOne({ _id: admin.roleId }).select('-_id name');
    const rolePermissions = await RoleHasPermission.find({ roleId: admin.roleId });
    const permissionIds = rolePermissions.map((rp: any) => rp.permissionId);
    const permissions = await Permission.find({ _id: { $in: permissionIds } }).select('-_id name');
    const permissionNames = permissions.map((permission: any) => permission.name);

    const responseObj = {
      // role: admin.adminrole,
      accessToken: accessToken,
      role: role,
      permissions: permissionNames,
      hasSubAdmin: admin.hasSubAdmin,
      user: {
        displayName: admin.name,
        id: admin._id,
        // photoURL: admin.image ? AppConstants.IMAGE_PATH + admin.image : null
      },
    };

    return commonUtils.sendAdminSuccess(req, res, responseObj);
  } catch (error) {
    return commonUtils.sendAdminError(req, res, { error: error }, 409);
  }
}

async function logout(req: Request, res: Response) {
  try {
    let userId = res.locals.payload.userId;
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(" ")[1];
    await Auth.adminLogout(userId, accessToken);
    return commonUtils.sendSuccess(req, res, {}, 204);
  } catch (err: any) {
    console.log(err);
    return commonUtils.sendError(req, res, {
      error: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function refreshToken(req: Request, res: Response) {
  try {
    let payload: AdminTokenPayload = res.locals.payload;
    const tokenData = await Auth.generateAdminAccessToken(payload);
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

const getProfile = async (req: any, res: Response) => {
  const payload: AdminTokenPayload = res.locals.payload;
  const admin = await Admin.findById(payload.userId).select(
    "_id name email mobile status google2fa_status"
  );
  return commonUtils.sendSuccess(req, res, admin);
};

const updateProfile = async (req: any, res: Response) => {
  const payload: AdminTokenPayload = res.locals.payload;
  const admin = await Admin.findById(payload.userId).exec();
  if (!admin)
    return commonUtils.sendError(
      req,
      res,
      { message: AppStrings.ADMIN_NOT_FOUND },
      409
    );

  const name = req.body?.name || admin.name;
  const email = req.body?.email || admin.email;
  const mobile = req.body?.mobile || admin.mobile;
  admin.name = name;
  admin.email = email;
  admin.mobile = mobile;

  await admin.save();
  await admin.updateOne({ name: name, email: email, mobile: mobile }).exec();
  return commonUtils.sendSuccess(
    req,
    res,
    { message: AppStrings.PROFILE_UPDATED },
    200
  );
};

const changePassword = async (req: any, res: Response) => {
  const payload: AdminTokenPayload = res.locals.payload;

  const old_password = req.body.old_password;
  const new_password = req.body.new_password;

  const admin = await Admin.findById(payload.userId).exec();

  if (!admin)
    return commonUtils.sendError(
      req,
      res,
      { message: AppStrings.USER_NOT_FOUND },
      409
    );

  const valid_password = await bcrypt.compare(old_password, admin.password);
  if (!valid_password)
    return commonUtils.sendError(
      req,
      res,
      { message: AppStrings.OLD_PASSWORD_INVALID },
      409
    );

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(new_password, salt);
  await admin.updateOne({ password: admin.password }).exec();

  return commonUtils.sendSuccess(
    req,
    res,
    { message: AppStrings.PASSWORD_CHANGED },
    200
  );
};

const userList = async (req: any, res: Response) => {
  const user = await User.find({
    $or: [
      { type: 2, makeAdmin: true }, // Users with type equal to 1
      { type: 4, makeAdmin: true }, // Users with type equal to 3 and makeAdmin equal to true
    ],
  }).select('_id firstName lastName companyName dotNumber mcNumber email mobile alternativeMobile type createdAt').sort({ createdAt: 'desc' });
  return commonUtils.sendSuccess(req, res, user);
}

const allUserList = async (req: any, res: Response) => {
  const user = await User.find().select(
    "_id firstName lastName companyName email mobile type"
  );
  return commonUtils.sendSuccess(req, res, user);
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  userList,
  allUserList,
};
