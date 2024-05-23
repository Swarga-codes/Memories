import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/util/connectDb";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import USER from "@/app/models/userSchema";
export async function GET(req:NextRequest) {
    try {
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();
        const splitUrl=req.url.split('/')
        const searchQuery=splitUrl[splitUrl.length-1];
        const getUsers=await USER.find({isVerified:true,email:{$ne:email}, $or:[
            {username:{$regex:searchQuery,$options:'i'}},
            {email:{$regex:searchQuery,$options:'i'}}
        ]}).select('-password -verifyOtp -verifyOtpExpiry')
        return NextResponse.json({success:true,message:'Fetched users successfully',users:getUsers},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not fetch users, try again!'},{status:500})
    }
}