import { NextFunction, Request, Response } from "express";
import commonUtils from "./commonUtils";
import moment from "moment";
const mongoose = require("mongoose");
import { UserType } from "./enum";
import phone from "phone";
import { AppStrings } from "./appStrings";
type DateArray = [string, string];

const Validator = require('validatorjs');
const validatorUtil = (body: any, rules: any, customMessages: any, callback: Function) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors.errors, false));
};

const validatorUtilWithCallback = (rules: any, customMessages: any, req: Request, res: Response, next: NextFunction) => {
    const validation = new Validator(req.body, rules, customMessages);
    validation.passes(() => next());
    validation.fails(() => commonUtils.sendError(req, res, {
        errors: commonUtils.formattedErrors(validation.errors.errors)
    }));
};

Validator.registerAsync('exist_value', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    let attArr = attribute.split(",");

    if (attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;

    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`

    mongoose.model(table).findOne({ [column]: value, _id: { $ne: _id } }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_value_with_type', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    let attArr = attribute.split(",");
    if (attArr.length !== 4) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id, 3: usertype } = attArr;

    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`

    mongoose.model(table).findOne({ [column]: value, usertype: usertype, _id: { $ne: _id } }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_value_admin', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    let attArr = attribute.split(",");
    if (attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;

    let msg = (column == "username") ? `${column} has already been taken ` : (column == "product_id") ? `This product already added` : `${column} already in use`

    mongoose.model(table).findOne({ [column]: value, _id: { $ne: _id } }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_mobile', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    let msg = `This number already in use`

    mongoose.model(table).findOne({ [column]: value }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_email', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;

    let msg = `This ${column} has already been used before.`

    mongoose.model(table).findOne({ [column]: value }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_mcNumber', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;

    let msg = `This MC Number is already registered with Know Your Trucker`
    let pendingMsg = `This MC number has registered with Know Your Trucker and is under review for approval...`

    mongoose.model(table).findOne({ [column]: value }).then((result: any) => {
        if (result) {
            if (result.isApprove == 1 || result.type == UserType.CARRIER || result.type == UserType.SUBCARRIER) {
                passes(false, msg);
            } else {
                passes(false, pendingMsg);
            }
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_with_type', function (value: any, attribute: any, req: Request, passes: any) {

    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');

    let attArr = attribute.split(",");

    if (attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: usertype } = attArr;

    let msg = (column == "username") ? `${column} has already been taken ` : (column == "product_id") ? `This product already added` : `${column} already in use`;

    mongoose.model(table).findOne({ [column]: value, usertype: usertype }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('check_email', function (value: any, attribute: any, req: Request, passes: any) {
    let email = value.toString();

    let email_string = email.substring(0, email.lastIndexOf("@"))

    let email_domain = email.substring(email_string.length + 1, email.length)

    let final_value = email_string.replaceAll('.', '', email.substring(0, email.lastIndexOf("@"))).replaceAll('+', '', email.substring(0, email.lastIndexOf("@"))) + '@' + email_domain;

    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');

    let attArr = attribute.split(",");

    if (attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: usertype } = attArr;

    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: final_value, usertype: usertype }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('check_email_only', async function (value: any, attribute: any, req: Request, passes: any) {
    let email = value.toString();
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');

    let attArr = attribute.split(",");

    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    let msg = `${column} already in use`;
    try {
        const isUser = await mongoose.model(table).findOne({ [column]: email })
      
        if (!isUser) {
          return passes()
        }
        await passes(false, msg)
    } catch (error) {
        console.log("error")
    }
});

Validator.registerAsync('mobile_lenght', function (value: any, attribute: any, req: Request, passes: any) {
    if (value.toString().length != attribute) {
        passes(false, `The ${req} must be at least ${attribute} digits.`);
    } else {
        passes();
    }
});

// valid_date function
Validator.registerAsync('valid_date', function (value: any, attribute: any, req: Request, passes: any) {
    if (moment(value, 'YYYY-MM-DD', true).isValid()) {
        passes();
    } else {
        passes(false, 'Invalid date format, it should be YYYY-MM-DD');
    }
});

//must_from:table,column
Validator.registerAsync('must_from', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: must_from:table,column');

    let attArr = attribute.split(",");
    if (attArr.length < 2 || attArr.length > 3) throw new Error('Specify Requirements i.e fieldName: must_from:table,column');
    const { 0: table, 1: column } = attArr;

    let msg = `${column} must be from ${table}`;

    mongoose.model(table).findOne({ [column]: value }).then((result: any) => {
        if (result) {
            passes();
        } else {
            passes(false, msg);
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('validObjectId', function (value: any, attribute: any, req: Request, passes: any) {
    if (value) {
        if (mongoose.Types.ObjectId.isValid(value) && typeof value === 'string') {
            passes();
        } else {
            passes(false, 'Invalid ObjectId');
        }
    }
});

Validator.registerAsync('date_before_today', function (value: any, attribute: any, req: Request, passes: any) {
    if (value) {
        if (moment(value).isBefore(moment())) {
            passes();
        } else {
            passes(false, `${value} must be before today`);
        }
    }
});

Validator.registerAsync('date_after_today_or_same', function (value: any, attribute: any, req: Request, passes: any) {
    if (value) {
        if (moment(value, 'YYYY-MM-DD').isAfter(moment().format('YYYY-MM-DD'))
            || moment(value, 'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD'))) {
            passes();
        } else {
            passes(false, `${value} must be after today`);
        }
    }
});

Validator.registerAsync('valid_time', function (value: any, attribute: any, req: Request, passes: any) {
    if (value) {
        if (moment(value, 'hh:mm a', true).isValid()) {
            passes();
        } else {
            passes(false, 'Invalid time');
        }
    }
});

Validator.registerAsync('date_after', function (value: any, attribute: DateArray, req: Request, passes: any) {
    try {
        if (value && attribute) {
            const { 0: field, 1: date } = attribute;
            const dateAfter = moment(date, 'YYYY-MM-DD', true);

            if (Array.isArray(value)) {
                const dateArr = value.map((date: any) => moment(date, 'YYYY-MM-DD', true));
                const unique = value.filter((v, i, a) => a.indexOf(v) === i);
                if (unique.length !== dateArr.length) {
                    passes(false, `${field} must be unique`);
                }
                const isValid = dateArr.every((date: any) => date.isAfter(dateAfter));
                if (isValid) {
                    passes();
                } else {
                    passes(false, `${field} must be after ${date}`);
                }
            } else {
                const dateValue = moment(value, 'YYYY-MM-DD', true);
                if (dateValue.isAfter(dateAfter)) {
                    passes();
                } else {
                    passes(false, `${field} must be after ${date}`);
                }
            }
        }
    } catch (error) {
        passes(false, `${value} must be after ${attribute}`);
    }
});

Validator.registerAsync('date_before', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: date_before:date');
    const { 0: date, 1: format } = attribute.split(",");
    if (value) {
        if (moment(value).isBefore(moment().add(-date, format))) {
            passes();
        } else {
            passes(false, `${value} must be before ${attribute}`);
        }
    }
});

Validator.registerAsync('validObjectId', function (value: any, attribute: any, req: Request, passes: any) {
    if (value) {
        if (mongoose.Types.ObjectId.isValid(value) && typeof value === 'string') {
            passes();
        } else {
            passes(false, 'Invalid ObjectId');
        }
    }
});

Validator.registerAsync('exist_cart_product', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 5) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: product_id, 3: user_column, 4: user_id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in cart`

    mongoose.model(table).findOne({ [column]: mongoose.Types.ObjectId(value), user_id: mongoose.Types.ObjectId(user_id) }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('coupon_exist', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');

    let attArr = attribute.split(",");
    if (attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: coupon_code } = attArr;

    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: coupon_code }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('check_mobile_only', function (value: any, attribute: any, req: Request, passes: any) {
    let mobile = value.toString();
    // console.log(mobile)
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');

    let attArr = attribute.split(",");

    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    // console.log(table)
    let msg = `${column} already in use`;
    // console.log(msg)
    mongoose.model(table).findOne({ [column]: mobile }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;

    let msg = ""
    // mobile, optionalMobile.secondary, optionalMobile.alternative
    msg = ('mobile'.includes(column)) ? `mobile number is already registered. login to continue` : `${column} is already registered. login to continue`

    mongoose.model(table).findOne({ [column]: value }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist', function (value: any, attribute: any, req: Request, passes: any) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id, 3: event_id } = attArr;

    // mobile, optionalMobile.secondary, optionalMobile.alternative
    let msg = (['optionalMobile.alternative', 'optionalMobile.secondary', 'mobile'].includes(column)) ? `mobile is already in use ` : `${column} already in use`

    mongoose.model(table).findOne({ [column]: value }).then((result: any) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err: any) => {
        passes(false, err);
    });
});

Validator.registerAsync('valid_phone', function (value: any, attribute: any, req: Request, passes: any) {
    if (value) {
        const phoneCheck = phone(value);
        if (phoneCheck.isValid === false) {
            return passes(false, AppStrings.MOBILE_IS_NOT_VALID)
        }
    }
    passes()
});
export default {
    validatorUtil,
    validatorUtilWithCallback
}