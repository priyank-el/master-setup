import mongoose from "mongoose"
 
const { Schema,model } = mongoose
const { ObjectId } = mongoose.Types

const paymentSchema = new Schema({
    userId:{
        type:ObjectId,
        ref:'User'
    },
    shippingInformation : {
        name:{
            type:String,
            default:null
        },
        address:{
            type:String,
            default:null
        },
        address2:{
            type:String,
            default:null
        }
    },
    paymentMethod:{
        methodName:{
            type:String,
            default:'credit card'
        },
        cardHolderName:{
            type:String,
            default:null
        },
        cardNumber:{
            type:String,
            default:null
        },
        expireMonth:{
            type:String,
            default:null,
            required:true
        },
        expireYear:{
            type:String,
            required:true,
            default:null
        },
        cardCVV:{
            type:String,
            required:true,
            default:null
        }
    },
    product:{
        type:Array,
        default:[]
    },
    payedMoney:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const Payment = model('Payment',paymentSchema)
export default Payment