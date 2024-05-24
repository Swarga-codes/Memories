import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import connectDb from "@/app/util/connectDb";
import USER from "@/app/models/userSchema";
import MEMORY from "@/app/models/memorySchema";
import FILE from "@/app/models/fileSchema";
export async function POST(req:NextRequest){
    try {
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();  
        const isExistingUser=await USER.findOne({email:email})
        if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
        const {imageData,memoryId}=await req.json()
        if(imageData.length===0) return NextResponse.json({success:false,message:'No images to upload!'},{status:422})
        const isValidMemory=await MEMORY.findOne({_id:memoryId})
        if(!isValidMemory) return NextResponse.json({success:false,message:'Memory not found!'},{status:404})
        if(!isValidMemory.memoryParticipants.includes(isExistingUser?._id.toString())) return NextResponse.json({success:false,message:'You do not have permission to modify this memory!'},{status:403})
        for(let i=0;i<imageData.length;i++){
    const image=new FILE({
        fileName:imageData[i].fileName,
        fileUrl:imageData[i].fileUrl,
        createdBy:isExistingUser._id,
        memoryId:memoryId
    })
    await image.save();
        }
        return NextResponse.json({success:true,message:'Pics uploaded successfully!'},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not save images to db!'},{status:500})
    }
} 