interface User{
    username:string,
    email:string,
    password:string,
    profilePic:string,
    verifyOtp:number,
    verifyOtpExpiry:Date,
    isVerified:Boolean,
    _id:string
}
interface Memory{
    title:string,
    description:string,
    memoryCoverPic:string,
    memoryParticipants: User[],
    createdBy:User,
    createdAt:Date,
    _id:string
}

interface File{
    fileName:string,
    fileUrl:string,
    createdBy:User,
    memoryId:Memory,
    createdAt:Date,
    _id:string
}

interface ParamsProps{
    params:{
        memoryId:string
    }
}

interface ImageURLs{
    fileName:string,
    fileUrl:string
}




export type{User,Memory,File,ParamsProps,ImageURLs}