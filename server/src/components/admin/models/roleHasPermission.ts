import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const mongoose_ = require("mongoose");

const RoleHasPermissionSchema = new mongoose_.Schema(
    {
        // adminId: {
        //     type: mongoose.Types.ObjectId,
        //     reference: "admins",
        //     default: null,
        // },
        roleId: {
            type: mongoose.Types.ObjectId,
            reference: "roles",
            default: null,
        },
        permissionId: {
            type: mongoose.Types.ObjectId,
            reference: "permissions",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose_.model(AppConstants.MODEL_ROLE_HAS_PERMISSION, RoleHasPermissionSchema);
