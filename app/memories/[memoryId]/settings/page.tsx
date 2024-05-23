'use client'
import React, { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
function Page({params:{memoryId}}) {
  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [coverPicUrl,setCoverPicUrl]=useState("")
  const [memoryParticipants,setMemoryParticipants]=useState([])
  const [search,setSearch]=useState("")
  const [memoryData,setMemoryData]=useState()
  async function fetchMemoryDetails(){
    const response=await fetch(`/api/memories/id/${memoryId}`);
    const data=await response.json()
    if(data.success){
      setMemoryData(data.memory)
      setTitle(data?.memory?.title)
      setDescription(data?.memory?.description)
      setCoverPicUrl(data?.memory?.memoryCoverPic)
    }
    else{
      toast.error(data.message)
    }
  
  }
  
  useEffect(()=>{
    fetchMemoryDetails()
  },[]) 
  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold'>{memoryData?.title} Settings</h1>
      <p className='italic'>Note: The details won't be updated unless you click the update details button!</p>
      <form>
      <div className='w-1/3 mt-4'>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="title"
      >
        Title
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-white bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        placeholder="Enter memory title"
        id="title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      ></input>
    </div>
    <div className="w-1/3 mt-4">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="description"
      >
        Description
      </label>
      <textarea
        className="flex h-40 w-full rounded-md border border-white bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter the memory description"
        id="description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      ></textarea>
    </div>
    <div className="w-full mt-4">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="memoryCoverPic"
      >
        Upload Memory Cover Pic
      </label>
      <br />
      <CldUploadWidget uploadPreset="memories" onSuccess={(results)=>{
        setCoverPicUrl(results?.info?.secure_url)
      }}>
  {({ open,isLoading }) => {
    return (
        <>
       {isLoading?
          <button type='button' className='bg-blue-400 p-2 text-white rounded-md'>Loading...</button>
       :
       <button type='button' className='bg-blue-500 p-2 text-white rounded-md' onClick={()=>open()}>Update Cover Photo</button>}
        </>
    );
  }}
</CldUploadWidget>
    <div className='mt-2'>
       {coverPicUrl && <Image src={coverPicUrl} height={250} width={200} alt={title}/>}
    </div>

    </div>
    <div className='w-1/3 mt-4'>
    <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="memoryParticipants"
      >
        Add Participants
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-white bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        placeholder="Enter memory participants to add"
        id="memoryParticipants"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      ></input>
    </div>
    <button className='mt-10 bg-blue-500 p-2 rounded-md'>Update Details</button>
      </form>
    </div>
  )
}

export default Page