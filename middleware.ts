import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken'
import { cookies } from "next/headers";
export function middleware(request:NextRequest){
    try{
   let path=request.nextUrl.pathname
   let token=request.cookies.get('token')?.value 
   let publicRoutes=path==='/login' || path==='/register'
   if(!token && !publicRoutes) return NextResponse.redirect(new URL('/login',request.nextUrl))
   if(token && publicRoutes) return NextResponse.redirect(new URL('/',request.nextUrl))
   }
catch(err){
    console.log(err)
    cookies().delete('token')
}
}

export const config={
    matcher:['/','/login','/register','/verifyOtp','/memories/:memoryId*','/userProfile']
}