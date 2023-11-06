import mongoose from "mongoose"

const brandSchema = new mongoose.Schema({
    brandName:{
        type:String,
        default:null,
        required:true
    },
    category_Id:{
        type:mongoose.Types.ObjectId,
        default:null,
        required:true,
        ref:'Category'
    },
    status:{
        type:String,
        enum:['active','block'],
        default:'active',
        required:true
    }
})

const Brand = mongoose.model('Brand',brandSchema)
export default Brand