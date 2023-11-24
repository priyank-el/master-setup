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
        comment:'0 - not available on free shipping , 1 - available on free shipping'
    },
    status:{
        type:String,
        enum:['active','block'],
        default:'active'
    },
    ratings:{
        type:Number,
        enum:[1,2,3,4,5],
        default:3,
        required:true,
        comment:'5- Outstanding, 4- Exceeds Expectations, 3- Meets Expectations, 2- Needs Improvement, 1- Unacceptable'
    }
})

const Product = mongoose.model('Product',productSchema)
export default Product