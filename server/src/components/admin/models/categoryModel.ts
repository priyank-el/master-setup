import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        default:null
    },
    status:{
        type:String,
        enum:['active','block'],
        default:'active'
    }
})

const Category = mongoose.model('Category',categorySchema)
export default Category