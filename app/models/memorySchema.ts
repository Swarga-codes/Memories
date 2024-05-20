import mongoose from 'mongoose';
const {ObjectId}=mongoose.Schema.Types
const memorySchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    memoryCoverPic:{
        type:String
    },
    memoryParticipants:[{type:ObjectId,ref:'USER'}],
    createdBy:{
        type:ObjectId,
        ref:'USER'
    }

},{
    timestamps:true
})

const MEMORY=mongoose.models.MEMORY ||  mongoose.model('MEMORY',memorySchema)

export default MEMORY;