import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
import MEMORY from "@/app/models/memorySchema";
export async function PUT(req:NextRequest){
try {
    const decodedToken = checkValidityOfToken(req);
    if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
    const email = decodedToken?.email;
    await connectDb();
    const isExistingUser=await USER.findOne({email:email})
    if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
    const {title,description,memoryCoverPic,memoryParticipants,memoryId}=await req.json()
    if(!title || !memoryId || memoryParticipants.length===0 || !memoryParticipants.includes(isExistingUser._id.toString())) return NextResponse.json({success:false,message:'One or more fields are missing'},{status:422})
    const isValidMemory= await MEMORY.findOne({_id:memoryId})
    if(!isValidMemory) return NextResponse.json({success:false,message:'Memory not found!'},{status:404})
    if((!isValidMemory.createdBy.equals(isExistingUser._id))) return NextResponse.json({success:false,message:'User not allowed to modify or access this memory!'},{status:403})
    isValidMemory.title=title
    isValidMemory.description=description
    isValidMemory.memoryCoverPic=memoryCoverPic
    isValidMemory.memoryParticipants=memoryParticipants
    await isValidMemory.save()
    return NextResponse.json({success:true,message:'Updated memory successfully!'},{status:200})
} catch (error) {
    console.log(error)
    return NextResponse.json({success:false,message:'Could not update user memory'},{status:500})
}
}