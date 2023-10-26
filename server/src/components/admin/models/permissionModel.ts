import { AppConstants } from "../../../utils/appConstants";

const mongoose_ = require("mongoose");

const PermissionSchema = new mongoose_.Schema(
    {
        name: {
            type: String,
            require: true,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose_.model(AppConstants.MODEL_PERMISSION, PermissionSchema);
