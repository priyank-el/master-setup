import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";
import { UserType } from "../../../utils/enum";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      default: null,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      default: null,
    },
    otp:{
      type: String,
      trim: true,
      default:null
    },
    isApprove: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is Not Approve 1 is Approve 2 is Rejected",
    },
    isVerified: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is Pending, 1 is Verify, 2 is Not verify",
    },
    activeStatus: {
      type: Number,
      required: false,
      default: 1,
      comment: "0 is inactive 1 active",
    },
    type: {
      type: Number,
      required: false,
      enum: UserType,
      default: UserType.BROKER,
      comment:"1 is BROKER"
    }
  },
  { timestamps: true }
);
const User = mongoose.model(AppConstants.MODEL_USER, userSchema);
export default User
