import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import connectDb from "@/app/util/connectDb";
import USER from "@/app/models/userSchema";
import MEMORY from "@/app/models/memorySchema";
export async function POST(req:NextRequest){
    try{
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();
        const isExistingUser=await USER.findOne({email:email})
        if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
        const {title,description,memoryCoverPic,memoryParticipants}=await req.json()
        memoryParticipants.push(isExistingUser?._id);
        if(!title) return NextResponse.json({success:false,message:'One or more fields are missing!'},{status:422})
        const memory=new MEMORY({
    title,
    description,
    memoryCoverPic,
    memoryParticipants,
    createdBy:isExistingUser?._id
        })

        await memory.save();
        return NextResponse.json({success:true,message:'Memory Created Successfully!'},{status:200})
        
        
    }
    catch(err){
        console.log(err)
        return NextResponse.json({success:false,message:"Could not create memory, try again!"},{status:500})
    }
}