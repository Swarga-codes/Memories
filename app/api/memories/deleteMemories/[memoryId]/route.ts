import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import USER from "@/app/models/userSchema";
import MEMORY from "@/app/models/memorySchema";
import connectDb from "@/app/util/connectDb";
import FILE from "@/app/models/fileSchema";
export async function DELETE(req:NextRequest){
    try {
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();  
        const isExistingUser=await USER.findOne({email:email})
        if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})  
        const splitUrl=req.url.split('/')
        const memoryId=splitUrl[splitUrl.length-1];
        const isValidMemory= await MEMORY.findOne({_id:memoryId})
        if(!isValidMemory) return NextResponse.json({success:false,message:'Memory not found!'},{status:404})
        if(isValidMemory.createdBy.toString()!==isExistingUser._id.toString()) return NextResponse.json({success:false,message:'You do not have permissions to delete this memory!'},{status:403})
        await MEMORY.findByIdAndDelete(memoryId)
        await FILE.deleteMany({memoryId:memoryId})
        return NextResponse.json({success:true,message:'Memory Deleted Successfully!'},{status:200})
        } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not delete memory, try again!'},{status:500})
    }
}