import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken'
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
 return NextResponse.redirect(new URL('/login',request.nextUrl))
}
}

export const config={
    matcher:['/','/login','/register','/verifyOtp']
}