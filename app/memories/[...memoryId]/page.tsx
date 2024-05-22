'use client'

import React from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
function Page({params:{memoryId}}) {
   
    
  return (
    <div className='p-10'>
        <div className='flex'>
        <h1 className='text-2xl font-bold'>Beach's Memories</h1>
        
        <CldUploadWidget uploadPreset="memories">
  {({ open, isLoading }) => {
    return (
        <>
        {isLoading?
        <button className='flex p-2 bg-pink-600 rounded-md ml-auto'>
            <span className='ml-2'>Loading...</span>
        </button>
        :
        <button className='flex p-2 bg-pink-600 rounded-md ml-auto' onClick={() => open()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

            <span className='ml-2'>Upload Images</span>
        </button>
  }
      </>
    );
  }}
</CldUploadWidget>
      
        </div>
        <p>Created By Markus on </p>
        <div>
    
        </div>
    </div>
  )
}

export default Page