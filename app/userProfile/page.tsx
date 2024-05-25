'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
function Page() {
    const router=useRouter()
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [profilePic,setProfilePic]=useState("")
    async function fetchUserData() {
        const response=await fetch('/api/users/getUserData')
        const data=await response.json()
        if(data.success){
            setEmail(data?.userData?.email)
            setUsername(data?.userData?.username)
            setProfilePic(data?.userData?.profilePic)
        }
        else{
            toast.error(data.message)
        }
    }
    async function updateProfile(){
        const response=await fetch('/api/users/updateProfile',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username,
                profilePic
            })
        })
        const data=await response.json()
        if(data.success){
            toast.success(data.message)
        }
        else{
            toast.error(data.message)
        }
    }
    useEffect(()=>{
        fetchUserData()
    },[])
  return (
    <div className='p-10'>
       <div className='flex items-center'>
        <div className='cursor-pointer' onClick={()=>router.push('/')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

        </div>
        <div className='ml-4'>
      <h1 className='text-2xl font-bold'>Profile Settings</h1>
      <p className='italic'>Note: The details won't be updated unless you click the update details button!</p>
      </div>
      </div>
      <form onSubmit={(e)=>{
        e.preventDefault()
        updateProfile()
      }}>
      <div className='w-1/3 mt-4'>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="username"
      >
        Username
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-white bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        placeholder="Enter the username"
        id="username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
      ></input>
    </div>
    <div className='w-1/3 mt-4'>
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="email"
      >
        Email
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-white bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="email"
        placeholder="Enter the email"
        id="email"
        value={email}
        disabled
      ></input>
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
        setProfilePic(results?.info?.secure_url)
      }}>
  {({ open,isLoading }) => {
    return (
        <>
       {isLoading?
          <button type='button' className='bg-blue-400 p-2 text-white rounded-md'>Loading...</button>
       :
       <button type='button' className='bg-blue-500 p-2 text-white rounded-md' onClick={()=>open()}>Update Profile Photo</button>}
        </>
    );
  }}
</CldUploadWidget>
    <div className='mt-2'>
       {profilePic && <Image src={profilePic} height={250} width={200} alt={username}/>}
    </div>

    </div>
    <button type='submit' className='mt-10 ml-4 bg-blue-500 p-2 rounded-md'>Update Profile</button>
      </form>
    </div>
  )
}

export default Page