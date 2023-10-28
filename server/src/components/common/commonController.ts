import { AppStrings } from "../../utils/appStrings";
import { NextFunction, Request, Response } from "express";
import commonUtils, { fileFilter, commonFileStorage, fileFilterPdf, fileStoragePdf } from "../../utils/commonUtils";
const multer = require("multer");

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    
    const { type } = req.params;
    let destination = "./uploads/images";
    if (type == "category") {
        destination = "./uploads/category"
    } else if (type == "user") {
        destination = "./uploads/user"
    } else if (type == "mainCategory") {
        destination = "./uploads/mainCategory"
    } else if (type == "subCategory") {
        destination = "./uploads/subCategory"
    } else if (type == "restaurant") {
        destination = "./uploads/restaurant"
    } else if (type == "foodItem") {
        destination = "./uploads/foodItem"
    } else if (type == "foodCategory") {
        destination = "./uploads/foodCategory"
    } else if (type == "vendor") {
        destination = "./uploads/vendor"
    } else if (type == "vendorKYC") {
        destination = "./uploads/vendorKYC"
    } else if (type == "admin") {
        destination = "./uploads/admin"
    } else if (type == "groceryCategory") {
        destination = "./uploads/groceryCategory"
    } else if (type == "groceryItem") {
        destination = "./uploads/groceryItem"
    } else if (type == "foodSubCategory") {
        destination = "./uploads/foodSubCategory"
    } else if (type == "groceryMenu") {
        destination = "./uploads/groceryMenu"
    } else if (type == "foodMenu") {
        destination = "./uploads/foodMenu"
    } else if (type == "eventImage") {
        destination = "./uploads/eventImage"
    } else if (type == "ngoItems") {
        destination = "./uploads/ngoItems"
    } else if (type == "travelmenu") {
        destination = "./uploads/travelmenu"
    } else if (type == "logo") {
        destination = "./uploads/images"
    } else if (type == "support") {
        destination = "./uploads/supportTicketAttachment"
    } else if (type == "advertisement") {
        destination = "./uploads/advertisement"
    } else if (type == "tickets") {
        destination = "./uploads/tickets"
    }
    const image_ = multer({
        storage: commonFileStorage(destination),
        fileFilter: fileFilter,
    }).single("image");

    image_(req, res, async (err:any) => {
        if (err) return commonUtils.sendError(req, res, { message: err.message }, 409);
        if (!req.file) return commonUtils.sendError(req, res, { message: AppStrings.IMAGE_NOT_FOUND }, 409);
        // const image_name = req.file.filename;
        const originam_image_name = req.file.originalname
        commonUtils.sendSuccess(req, res, {
            file_name: originam_image_name
        }, 200);
    });
}

async function uploadPdf(req: Request, res: Response, next: NextFunction) {
    const file = multer({
        storage: fileStoragePdf,
        fileFilter: fileFilterPdf,
        limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }
    }).single("pdf");

    file(req, res, async (err: any) => {

        if (err) {

            return commonUtils.sendError(req, res, { message: "Pdf not uploaded" }, 409);
        }
        if (!req.file) return commonUtils.sendError(req, res, { message: "Pdf not found" }, 404);
        const image_name = req.file.filename;
        return commonUtils.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    });
}

export default {
    uploadImage,
    uploadPdf
}