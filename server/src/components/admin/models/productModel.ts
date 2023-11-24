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
    price:{
        type:String,
        default:null,
        required:true
    },
    image:{
        type:String,
        default:null,
        required:true
    },
    isFreeShipping:{
        type:Number,
        enum:[0,1],
        default:1,
        required:true,
        comment:'value for 0 is not available on free shipping and 1 is available on free shipping'
    },
    status:{
        type:String,
        enum:['active','block'],
        default:'active'
    }
})

const Product = mongoose.model('Product',productSchema)
export default Product