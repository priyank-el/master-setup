import mongoose from "mongoose"
 
const { Schema,model } = mongoose
const { ObjectId } = mongoose.Types

const paymentSchema = new Schema({
    userId:{
        type:ObjectId,
        ref:'User'
    },
    // shippingInformation : {
    //     name:{
    //         type:String,
    //         default:null
    //     },
    //     address:{
    //         type:String,
    //         default:null
    //     },
    //     address2:{
    //         type:String,
    //         default:null
    //     }
    // },
    paymentMethod:{
        type:String,
        default:'Card'
    },
    product:{
        type:Array,
        default:[]
    },
    payedMoney:{
        type:Number,
        default:0
    },
    paymentStatus:{
        type:Number,
        enum:[0,1],
        default:1,
        comment:'0 - failed, 1 - success'
    },
    delivered:{
        type:Number,
        enum:[0,1,2],
        default:0,
        comment:'0 - pending, 1 - on the way, 2 - success'
    }
},{
    timestamps:true
})

const Payment = model('Payment',paymentSchema)
export default Payment