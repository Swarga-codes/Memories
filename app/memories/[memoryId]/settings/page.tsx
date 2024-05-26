'use client'
import React, { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Memory, ParamsProps, User } from '@/app/util/types'
function Page({params:{memoryId}}:ParamsProps) {
  const router=useRouter()
  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [coverPicUrl,setCoverPicUrl]=useState("")
  const [memoryParticipants,setMemoryParticipants]=useState<User[]>([])
  const [search,setSearch]=useState("")
  const [searchResults,setSearchResults]=useState([])
  const [memoryData,setMemoryData]=useState<Memory>()
  async function fetchMemoryDetails(){
    const response=await fetch(`/api/memories/id/${memoryId}`);
    const data=await response.json()
    if(data.success){
      setMemoryData(data.memory)
      setTitle(data?.memory?.title)
      setDescription(data?.memory?.description)
      setCoverPicUrl(data?.memory?.memoryCoverPic)
     setMemoryParticipants(data?.memory?.memoryParticipants)
    }
    else{
      toast.error(data.message)
    }
  }
  async function fetchUsersBasedOnSearchQuery() {
    const response=await fetch(`/api/users/${search}`)
    const data=await response.json()
    if(data.success){
    setSearchResults(data.users)
    }
    else{
      toast.error(data.message)
    }
  }
  async function updateMemoryDetails(){
    let memoryParticipantsId=memoryParticipants.map((participant:User)=>participant._id)
    const response=await fetch('/api/memories/updateMemories',{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        title,
        description,
        memoryCoverPic:coverPicUrl,
        memoryParticipants:memoryParticipantsId,
        memoryId
      })

    })
    const data=await response.json()
    if(data.success){
      toast.success(data.message)
      router.push('/')
    }
    else{
      toast.error(data.message)
    }
  }
  async function deleteMemory(){
    const response=await fetch(`/api/memories/deleteMemories/${memoryId}`,{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json'
      }
    })
    const data=await response.json()
    if(data.success){
      toast.success(data.message)
      router.push('/')
    }
    else{
      toast.error(data.message)
    }
  }
  useEffect(()=>{
    fetchMemoryDetails()
  },[]) 
  useEffect(()=>{
    if(search){
fetchUsersBasedOnSearchQuery()
    }
  },[search])

  return (
    <div className='p-10'>
      <div className='flex items-center'>
        <div className='cursor-pointer' onClick={()=>router.push(`/memories/${memoryId}`)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

        </div>
        <div className='ml-4'>
      <h1 className='text-2xl font-bold'>{memoryData?.title} Settings</h1>
      <p className='italic'>Note: The details won&apos;t be updated unless you click the update details button!</p>
      </div>
      </div>
      <form onSubmit={(e)=>{
        e.preventDefault()
        updateMemoryDetails()
      }}>
      <div className='w-full sm:w-1/3 mt-4'>
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
    <div className="w-full sm:w-1/3 mt-4">
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
    <div className="w-full sm:w-1/3 mt-4">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="memoryCoverPic"
      >
        Upload Memory Cover Pic
      </label>
      <br />
      <CldUploadWidget uploadPreset="memories" onSuccess={(results:any)=>{
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
    <div className='w-full sm:w-1/3 mt-4'>
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
     {search && searchResults.length>0 &&
      <div className='p-4 border-2 border-white mt-2 rounded-xl'>
       {searchResults?.map((result:any)=>(
        <div key={result?._id} onClick={()=>{
          let memoryParticipantsId=memoryParticipants.map((participant:User)=>participant._id)
          if(memoryParticipantsId.includes(result?._id)){
            toast.error('Participant already exists!')
            return
          }
          else{
            setMemoryParticipants([...memoryParticipants,result])
          }
        }}>
        <p className='text-md font-bold'>{result?.username}</p>
        <p className='text-sm'>{result?.email}</p>
        </div>
       )) 
       }
      </div>
      }
      {search && searchResults.length===0 && <div className='p-4 border-2 border-white mt-2 rounded-xl'>
        <div>
        <p className='text-md font-bold'>No user found.</p>
        </div>
      </div>}
      <div className='flex flex-wrap mt-4'>
     {memoryParticipants?.map((participant:User)=>(
      <div className='bg-blue-500 flex p-2 rounded-md ml-2 my-2' key={participant?._id}>
        <p>{participant?.username}</p>
      {memoryData?.createdBy?._id===participant?._id?
<span className='font-bold'> (Author)</span>
      :
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2" onClick={()=>{
          let removedMemoryParticipant=memoryParticipants.filter(memoryParticipant=>memoryParticipant._id!==participant._id)
          setMemoryParticipants([...removedMemoryParticipant])
        }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>}
   
     
      </div>  )) }
      </div>
    </div>
    <button type='button' className='mt-10 bg-red-500 p-2 rounded-md' onClick={()=>{
      if(window.confirm('Do you really wanna delete this memory?')){
        deleteMemory()
      }
    }}>Delete Memory</button>
    <button type='submit' className='mt-10 ml-4 bg-blue-500 p-2 rounded-md'>Update Details</button>
      </form>
    </div>
  )
}

export default Page