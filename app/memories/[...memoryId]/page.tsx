'use client'

import React, { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
import UploadImagesDialog from '@/app/ui/UploadImagesDialog'
function Page({params:{memoryId}}) {

   const [open, setOpen] = useState(false)


  return (
    <>
    <div className='p-10'>
        <div className='flex'>
        <h1 className='text-2xl font-bold'>Beach's Memories</h1>
        <button className='flex p-2 bg-pink-600 rounded-md ml-auto' onClick={() => setOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

            <span className='ml-2'>Upload Images</span>
        </button>
    
      
        </div>
        <p>Created By Markus on </p>
        <div>
    
        </div>
    </div>
    <UploadImagesDialog open={open} setOpen={setOpen} memoryId={memoryId}/>
    </>
  )
}

export default Page