'use client'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { CldUploadWidget } from 'next-cloudinary'
import toast from 'react-hot-toast'
import Image from 'next/image'
export default function CreateMemoryDialog({open,setOpen}:any) {
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [coverPicUrl,setCoverPicUrl]=useState('')  

  const cancelButtonRef = useRef(null)
async function createMemory(){
    const response=await fetch('/api/memories/createMemories',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            title,
            description,
            memoryCoverPic:coverPicUrl,
            memoryParticipants:[],
        })
    })
    const data=await response.json()
    if(data.success){
        toast.success(data.message)
        setOpen(false)
    }
    else{
        toast.error(data.message)
    }
}

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
               <div className='p-5 text-black'>
                <h1 className='font-bold text-2xl'>Create a Memory.</h1>
                <form className='mt-4' onSubmit={(e)=>{
                    e.preventDefault();
                    createMemory()
                }}>
                <div className="w-full mb-2">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="title"
      >
        Title
      </label>
      <input
        className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        placeholder="Enter the memory title"
        id="title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      ></input>
    </div>
    <div className="w-full mb-2">
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="description"
      >
        Description
      </label>
      <textarea
        className="flex h-40 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter the memory description"
        id="description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      ></textarea>
    </div>
    <div className="w-full mb-2">
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
       <button type='button' className='bg-blue-500 p-2 text-white rounded-md' onClick={()=>open()}>Upload Cover Photo</button>}
        </>
    );
  }}
</CldUploadWidget>
    <div className='mt-2'>
       {coverPicUrl && <Image src={coverPicUrl} height={50} width={100} alt={title}/>}
    </div>
    </div>
    
    <div className='mt-4 text-end'>
        <button type='button' onClick={()=>setOpen(false)} className='bg-transparent border-2 border-blue-500 p-2 text-black rounded-md mr-2'>Cancel</button>
  <button type='submit' className='bg-blue-600 p-2 text-white rounded-md'>Create Memory</button>
    </div>
                </form>
               </div>
               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
