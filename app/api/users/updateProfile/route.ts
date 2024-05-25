import { NextRequest, NextResponse } from "next/server";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import connectDb from "@/app/util/connectDb";
import USER from "@/app/models/userSchema";
export async function PUT(req:NextRequest) {
    try {
        const decodedToken = checkValidityOfToken(req);
        if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
        const email = decodedToken?.email;
        await connectDb();  
        const isExistingUser=await USER.findOne({email:email})
        if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404}) 
        const {username,profilePic}=await req.json()
        if(!username) return NextResponse.json({success:false,message:'Username cannot be empty!'},{status:422})
        if(isExistingUser.email!==email) return NextResponse.json({success:false,message:'You do not have permission to perform this action!'},{status:403})
        isExistingUser.username=username
        isExistingUser.profilePic=profilePic
        await isExistingUser.save();
        return NextResponse.json({success:true,message:'Profile data updated successfully!'},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:'Could not update profile, try again!'},{status:500})
    }
}