'use client'

import React, { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
import UploadImagesDialog from '@/app/ui/UploadImagesDialog'
import Link from 'next/link'
function Page({params:{memoryId}}) {

   const [open, setOpen] = useState(false)
   const [images,setImages]=useState([])
   const [memoryData,setMemoryData]=useState()
   const [userId,setUserId]=useState("")
async function fetchMemoryImages(){
  const response=await fetch(`/api/memories/id/${memoryId}`);
  const data=await response.json()
  if(data.success){
    setImages(data.images)
    setMemoryData(data.memory)
  }
  else{
    toast.error(data.message)
  }

} 
async function downloadFile(fileName:string,fileUrl:string){
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
    toast.error('Failed to download image')
  }
}
useEffect(()=>{
fetchMemoryImages()
},[])
useEffect(()=>{
if(typeof localStorage!=undefined){
  setUserId(localStorage.getItem('userId'))
}
},[])
  return (
    <>
    <div className='p-10'>
        <div className='flex'>
        <h1 className='text-2xl font-bold'>{memoryData?.title}</h1>
        <button className='flex p-2 bg-pink-600 rounded-md ml-auto' onClick={() => setOpen(true)}>
       
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>
            <span className='ml-2'>Upload Images</span>
        </button>
       {userId===memoryData?.createdBy._id && <button className='ml-4'>
          <Link href={`/memories/${memoryId}/settings`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  
</svg>
</Link>
</button> } 
        </div>
     <p>Created by {memoryData?.createdBy?.username} on {memoryData?.createdAt?.substring(0,10)}</p>
     <p className='font-bold italic'>"{memoryData?.description}"</p>
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
   
    <UploadImagesDialog open={open} setOpen={setOpen} memoryId={memoryId} fetchMemoryImages={fetchMemoryImages}/>
    </>
  )
}

export default Page