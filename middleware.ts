import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken'
export function middleware(request:NextRequest){
   let path=request.nextUrl.pathname
   let token=request.cookies.get('token')?.value
   let verifyToken;
   try{
    if(token){
    verifyToken=jsonwebtoken.verify(token,process.env.SECRET_KEY || "")
    }
   }
   catch(error){
     NextResponse.redirect(new URL('/login',request.nextUrl))
   }
   let publicRoutes=path==='/login' || path==='/register'
   if(!token && !verifyToken && !publicRoutes) return NextResponse.redirect(new URL('/login',request.nextUrl))
   if(token && verifyToken && publicRoutes) return NextResponse.redirect(new URL('/',request.nextUrl))

}

export const config={
    matcher:['/','/login','/register','/verifyOtp']
}