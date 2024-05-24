import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import connectDb from "@/app/util/connectDb";
import USER from "@/app/models/userSchema";
import FILE from "@/app/models/fileSchema";
import MEMORY from "@/app/models/memorySchema";
export async function GET(req:NextRequest){
    try {
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();  
        const isExistingUser=await USER.findOne({email:email})
        if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
        const splitUrl=req.url.split('/')
        const memoryId=splitUrl[splitUrl.length-1];
        const isValidMemory= await MEMORY.findOne({_id:memoryId}).populate('createdBy').populate({path:'memoryParticipants',select:'-password -verifyOtp -verifyOtpExpiry'})
        if(!isValidMemory) return NextResponse.json({success:false,message:'Memory not found!'},{status:404})
        const memoryParticipantsId=isValidMemory.memoryParticipants.map(participant=>participant._id.toString())
        if(!memoryParticipantsId.includes(isExistingUser._id.toString())) return NextResponse.json({success:false,message:'User not allowed to access this memory!'},{status:403})
        const getMemoryImages=await FILE.find({memoryId:memoryId})
    return NextResponse.json({success:true,message:'Successfully fetched memory data!',images:getMemoryImages, memory:isValidMemory},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not fetch memory data!'},{status:500})
    }
}