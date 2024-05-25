interface USER{
    username:string,
    email:string,
    password:string,
    profilePic:string,
    verifyOtp:number,
    verifyOtpExpiry:Date,
    isVerified:Boolean,
    _id:string
}
interface MEMORY{
    title:string,
    description:string,
    memoryCoverPic:string,
    memoryParticipants: USER[],
    createdBy:USER,
    createdAt:Date,
    _id:string
}

interface FILE{
    fileName:string,
    fileUrl:string,
    createdBy:USER,
    memoryId:MEMORY,
    createdAt:Date,
    _id:string
}

interface ParamsProps{
    params:{
        memoryId:string
    }
}

export type{USER,MEMORY,FILE,ParamsProps}