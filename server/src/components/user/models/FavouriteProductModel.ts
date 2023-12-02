import mongoose from "mongoose"

const { Schema, model } = mongoose
const { ObjectId } = mongoose.Types

const favouriteProductSchema = new Schema({
    productId:{
        type:ObjectId,
        ref:'Product',
        default:null
    },
    userId:{
        type:ObjectId,
        ref:'User',
        default:null
    }
})

const FavouriteProduct = model('favouriteProduct',favouriteProductSchema)
export default FavouriteProduct