import mongoose from "mongoose";

const {Schema,model} = mongoose
const {ObjectId} = mongoose.Types

const cartSchema = new Schema({
    userId:{
        type:ObjectId,
        ref:'User'
    },
    productId:{
        type:ObjectId,
        ref:'Product'
    },
    price:{
        type:String,
        default:null,
        // required:true
    },
    numberOfProducts:{
        type:Number,
        default:1,
        // required:true
    }
},
{
    timestamps:true
})

const Cart = model('Cart',cartSchema)
export default Cart