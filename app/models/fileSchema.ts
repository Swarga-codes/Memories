import mongoose from "mongoose";
const {ObjectId}=mongoose.Schema.Types
const fileSchema=new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    createdBy:{
        type:ObjectId,
        ref:'USER'
    },
    memoryName:{
        type:ObjectId,
        ref:'MEMORY'
    }
},{
    timestamps:true
})

const FILE=mongoose.models.FILE || mongoose.model('FILE',fileSchema)

export default FILE;