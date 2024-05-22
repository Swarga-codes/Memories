import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import connectDb from "@/app/util/connectDb";
import USER from "@/app/models/userSchema";
import MEMORY from "@/app/models/memorySchema";
export async function GET(req:NextRequest) {
    try{
    const decodedToken = checkValidityOfToken(req);
    if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
    const email = decodedToken?.email;
    await connectDb();
    const isExistingUser=await USER.findOne({email:email})
    if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
    const getMemories=await MEMORY.find({ $or:[  {createdBy:isExistingUser._id},{memoryParticipants:isExistingUser._id}]})
    return NextResponse.json({success:true,message:'Fetched user memories',memories:getMemories},{status:200})
    }
catch(err){
    console.log(err)
    return NextResponse.json({success:false,message:'Could not fetch user memories!'},{status:500})
}
}