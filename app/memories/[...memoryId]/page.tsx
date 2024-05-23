'use client'

import React, { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
import UploadImagesDialog from '@/app/ui/UploadImagesDialog'

function Page({params:{memoryId}}) {

   const [open, setOpen] = useState(false)
   const [images,setImages]=useState([])
async function fetchMemoryImages(){
  const response=await fetch(`/api/memories/id/${memoryId}`);
  const data=await response.json()
  if(data.success){
    setImages(data.images)
  }
  else{
    toast.error(data.message)
  }
} 
async function downloadFile(fileName,fileUrl){
  try {
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading the image:', error)
    toast.error('Failed to download image')
  }
}
useEffect(()=>{
fetchMemoryImages()
},[])
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
        {/* <p>Created By {} on </p> */}
        <div>
    
        </div>
        <div className='mt-6 flex flex-wrap'>
     {images?.map(image=>(
      <div key={image?._id} className='m-2 border-2 border-white rounded-md p-2'>
  <Image src={image?.fileUrl} alt={image?.fileName} height={200} width={400}/>
  <div className='flex'>
    <div>
  <p className='p-2'>{image?.fileName}</p>
  <p className='p-2'>Uploaded on {image?.createdAt.substring(0,10)}</p>
  </div>
  <div className='ml-auto m-4 cursor-pointer' onClick={()=>downloadFile(image?.fileName,image?.fileUrl)}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>

  </div>
  </div>
  </div>
     ))

     }
     </div>
    </div>
   
    <UploadImagesDialog open={open} setOpen={setOpen} memoryId={memoryId}/>
    </>
  )
}

export default Page