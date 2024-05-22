import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    
    try{
        const {imagePath}=await req.json()
        console.log(await req.json())
 
    return NextResponse.json({success:true},{status:200})
    }
    catch(err){
        console.log(err)
    }
}