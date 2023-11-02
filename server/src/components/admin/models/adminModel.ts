import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      require: false,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      require: false,
      min: 10,
      max: 10,
    },
    profile: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: false,
    },
    otp:{
      type:String
    },
    status: {
      type: Number,
      required: false,
      default: 1,
      comment: "0 is Deactive 1 is Active",
    },
    hasSubAdmin: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is Super-Admin 1 is Sub_Admin",
    },
    roleId: {
      type: mongoose.Types.ObjectId,
      reference: "roles",
      default: null,
    },
    google2fa_secret: {
      type: String,
      require: false,
      default: null,
    },
    google2fa_status: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is Deactive 1 is Active",
    },
  },
  { timestamps: true }
);

adminSchema.index({
  location: "2dsphere",
});

const Admin = mongoose.model(AppConstants.MODEL_ADMIN, adminSchema)
export default Admin;
