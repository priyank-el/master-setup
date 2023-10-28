import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import { AppStrings } from "../../utils/appStrings";

async function registerValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "username": "required|regex:/[A-Za-z]/|string|max:25",
        "email": "required|string|max:255|check_email_only:User,email",
        // "email": "required|string|email|max:255",
        "password": "required|min:6|max:50"
    }
    if (req.body.type == 2) {
        validationRule.dotNumber = "required"
        // validationRule.mobile = "valid_phone|required|string|min:8|max:15"
    }
    if (req.body.type == 1) {
        // validationRule.alternativeMobile = "valid_phone|string|min:8|max:15|different:mobile|exist_mobile:User,alternativeMobile|exist_mobile:User,mobile"
        // validationRule.mobile = "valid_phone|required|string|min:8|max:15|exist_mobile:User,mobile"
    }
    // const customErrorMessages = {
    //     "different.alternativeMobile": "This number must be different from the mobile number.",
    // };
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function loginValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "email": "required",
        "password": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function forgetPwdValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "email": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function resetPwdValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "password": "required|min:6|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/",
        "confirmPassword": "required|min:6|max:50|same:password",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function changePwdValidation(req: any, res: any, next: NextFunction) {
    let validationRule: any = {
        "old_password": "required|min:6|max:50",
        "new_password": "required|min:6|max:50|different:old_password|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/",
        "confirmPassword": "required|min:6|max:50|same:new_password",
    }
    validator.validatorUtilWithCallback(validationRule, { different: AppStrings.DIFFERENT_PWD_NEW_OLD }, req, res, next);
}

async function updateProfile(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "firstName": "required|regex:/[A-Za-z]/|string|max:255",
        "lastName": "required|regex:/[A-Za-z]/|string|max:255",
        // "alternativeMobile": "valid_phone|string|min:8|max:15|different:mobile|exist_mobile:User,alternativeMobile|exist_mobile:User,mobile",
        "alternativeMobile": "valid_phone|string|min:8|max:15",
        "ext": "max:25",
    }
    const customErrorMessages = {
        "different.alternativeMobile": "This number must be different from the mobile number.",
    };
    validator.validatorUtilWithCallback(validationRule, customErrorMessages, req, res, next);
}

export default {
    registerValidation,
    loginValidation,
    forgetPwdValidation,
    resetPwdValidation,
    changePwdValidation,
    updateProfile,
}