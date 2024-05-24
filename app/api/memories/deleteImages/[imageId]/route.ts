import { NextRequest,NextResponse } from "next/server";
import connectDb from "@/app/util/connectDb";
import { checkValidityOfToken } from "@/app/util/checkValidityOfToken";
import USER from "@/app/models/userSchema";
import FILE from "@/app/models/fileSchema";
export async function DELETE(req:NextRequest){
    try{
    const decodedToken = checkValidityOfToken(req);
    if (!decodedToken.success) return NextResponse.json(decodedToken, { status: 401 });
    const email = decodedToken?.email;
    await connectDb();  
    const isExistingUser=await USER.findOne({email:email})
    if(!isExistingUser) return NextResponse.json({success:false,message:'User not found!'},{status:404})
    const splitUrl=req.url.split('/')
    const imageId=splitUrl[splitUrl.length-1];
    const isValidImage=await FILE.findOne({_id:imageId}).populate('memoryId')
    if(!isValidImage) return NextResponse.json({success:false,message:'Image not found!'},{status:404})
    if((isValidImage.createdBy.toString()!==isExistingUser._id.toString()) && (isValidImage.memoryId.createdBy.toString()!==isExistingUser._id.toString())) return NextResponse.json({success:false,message:'User not authorized to perform this action!'},{status:403})
    await FILE.findByIdAndDelete(imageId)
    return NextResponse.json({success:true,message:'Picture deleted successfully!'},{status:200})
    }
catch(err){
    console.log(err)
    return NextResponse.json({success:false,message:'Could not delete image, try again!'},{status:500})
}
}