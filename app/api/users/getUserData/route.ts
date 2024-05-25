import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import USER from "@/app/models/userSchema";
import connectDb from "@/app/util/connectDb";
export async function GET(req:NextRequest){
    try {
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();  
        const isExistingUser=await USER.findOne({email:email}).select('-password -verifyOtp -verifyOtpExpiry')
        if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404}) 
        return NextResponse.json({success:true,userData:isExistingUser},{status:200}) 
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not fetch user data, try again!'},{status:500})
    }
}