import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { AppStrings } from "../../utils/appStrings";
import {
    UserTokenPayload,
} from "../../auth/models";

async function registerValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "required|string|email|max:255|check_email:Admin,email," + req.body.email + "|exist_with_type:Admin,email," + req.body.email,
        "mobile": "required|numeric|min:8|exist_with_type:Admin,mobile," + req.body.mobile,
        "password": "required|min:6|max:50",
        // "adminrole": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function profileValidation(req: Request, res: Response, next: NextFunction) {

    const payload: UserTokenPayload = res.locals.payload

    const ValidationRule = {
        "name": "required|string|min:3|max:255",
        "email": "string|email|max:255|exist_value_admin:Admin,email," + payload.userId,
        "mobile": "numeric|min:8|exist_value_admin:Admin,mobile," + payload.userId,
    }

    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function changePasswordValidation(req: any, res: any, next: NextFunction) {
    const payload: UserTokenPayload = res.locals.payload
    if (payload.userId === undefined)
        return commonUtils.sendError(req, res, { message: AppStrings.USERID_MISSING }, 409);

    const validationRule = {
        "old_password": "required|max:50",
        "new_password": "required|min:6|max:50|different:old_password",
        "confirm_password": "required|min:6|max:50|same:new_password",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function userProfileValidation(req: Request, res: Response, next: NextFunction) {

    const userId = req.body.user_id;
    const ValidationRule = {
        "fullname": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "string|email|max:255|exist_value_admin:User,email," + userId,
        "mobile": "numeric|min:8|mobile_lenght:15|exist_value_admin:User,mobile," + userId,
        "dob": "required",
        "usertype": "required",
        "country_code": "required",
        "push_token": "required"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function OTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        // "otp": "required", 
        "device": "required"
    }
    if (!req.body.email) {
        validationRule.mobile = "required"
    }
    else {
        validationRule.email = "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function verifyOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "otp": "required"
    }
    if (!req.body.email) {
        validationRule.mobile = "required"
    }
    else {
        validationRule.email = "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    registerValidation,
    profileValidation,
    changePasswordValidation,
    userProfileValidation,
    verifyOTPValidation,
    OTPValidation,
}