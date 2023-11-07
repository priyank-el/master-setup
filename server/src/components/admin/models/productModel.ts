import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        default:null,
        required:true
    },
    productDescription:{
        type:String,
        default:null,
        required:true
    },
    productCategory:{
        type:mongoose.Types.ObjectId,
        ref:'Category',
        default:null,
        required:true
    },
    productBrand:{
        type:mongoose.Types.ObjectId,
        ref:'Brand',
        default:null,
        required:true
    },
    image:{
        type:String,
        default:null,
        required:true
    },
    status:{
        type:String,
        enum:['active','block'],
        default:'active'
    }
})

const Product = mongoose.model('Product',productSchema)
export default Product