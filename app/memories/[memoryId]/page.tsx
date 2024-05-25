'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import UploadImagesDialog from '@/app/ui/UploadImagesDialog'
import Link from 'next/link'
import JSZip from 'jszip'
import {saveAs} from 'file-saver';
import { MEMORY, ParamsProps,FILE } from '@/app/util/types'
function Page({params:{memoryId}}:ParamsProps) {

   const [open, setOpen] = useState(false)
   const [images,setImages]=useState<FILE[]>([])
   const [memoryData,setMemoryData]=useState<MEMORY>()
   const [userId,setUserId]=useState("")
   const [loading,setLoading]=useState(false)
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
setLoading(false)
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
async function deleteImage(imageId:string) {
  const response=await fetch(`/api/memories/deleteImages/${imageId}`,{
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    }
  })
  const data=await response.json()
  if(data.success){
    toast.success(data.message)
    fetchMemoryImages()
  }
  else{
    toast.error(data.message)
  }
}
async function handleFullAlbumDownload(){
const zip=new JSZip()
const createFolder=zip.folder(`${memoryData?.title}_images`)
for(let i=0;i<images.length;i++){
  try{
    const response=await fetch(images[i]?.fileUrl)
    const blob=await response.blob()
    const fileType=blob.type || 'image/jpeg'
    createFolder?.file(`${images[i]?.fileName}.${fileType.split('/')[1]}`,blob)
  }
  catch(err){
    console.log(err)
    toast.error('Error fetching Image...')
  }
}
const saveFile=await zip.generateAsync({type:'blob'})
if(saveFile){
  saveAs(saveFile,`${memoryData?.title}_images.zip`)
}
else{
  toast.error('Could not download file, try again!')
}
}
useEffect(()=>{
  setLoading(true)
fetchMemoryImages()
},[])
useEffect(()=>{
if(typeof localStorage!=undefined){
  setUserId(localStorage.getItem('userId') || "")
}
},[])
  return (
    <>
    {loading?
  <h1 className="p-10 text-bold">Loading data....</h1>
  :
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
     <p>Created by {memoryData?.createdBy?.username} on {memoryData?.createdAt?.toString()?.substring(0,10)}</p>
     <p className='font-bold italic'>&quot;{memoryData?.description}&quot;</p>
     <button className='flex p-2 bg-green-600 rounded-md mt-4' onClick={()=>{
      if(window.confirm(`Do you really want to download the memory ${memoryData?.title} as zip?`)){
        handleFullAlbumDownload()
      }
     }}>
       
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>
                   <span className='ml-2'>Download memory as Zip</span>
               </button>
        <div>
    
        </div>
        <div className='mt-6 flex flex-wrap'>
     {images?.map(image=>(
      <div key={image?._id} className='m-2 border-2 border-white rounded-md p-2'>
  <Image src={image?.fileUrl} alt={image?.fileName} height={200} width={400}/>
  <div className='flex'>
    <div>
  <p className='p-2'>{image?.fileName}</p>
  <p className='p-2'>Uploaded on {image?.createdAt.toString().substring(0,10)}</p>
  </div>
  <div className='ml-auto m-4 cursor-pointer'>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>downloadFile(image?.fileName,image?.fileUrl)}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6 mt-2" onClick={()=>{
  if(window.confirm('Do you really wanna delete this image?')){
    deleteImage(image?._id)
  }
}}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

  </div>
  </div>
  </div>
     ))

     }
     </div>
    </div>
    </>
  }
   
   
    <UploadImagesDialog open={open} setOpen={setOpen} memoryId={memoryId} fetchMemoryImages={fetchMemoryImages}/>
    </>
  )
}

export default Page