import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const {title,description,memoryCoverPic,memoryParticipants}=await req.json()
        if(!title || memoryParticipants.length===0) return NextResponse.json({success:false,message:'One or more fields are missing!'},{status:422})
        
    }
    catch(err){
        console.log(err)
        return NextResponse.json({success:false,message:"Could not create memory, try again!"},{status:500})
    }
}