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
        const getUsers=await USER.find({isVerified:true}).select('-password -verifyOtp -verifyOtpExpiry')
        const filterTheRequestedUser=getUsers.filter(user=>user.email!==email)
        return NextResponse.json({success:true,message:'Fetched users successfully',users:filterTheRequestedUser},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not fetch users, try again!'},{status:500})
    }
}