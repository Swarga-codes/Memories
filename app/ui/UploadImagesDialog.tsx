'use client'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { ImageURLs } from '../util/types'
export default function UploadImagesDialog({open,setOpen,memoryId,fetchMemoryImages}:any) {
 
    const [imageUrls,setImageUrls]=useState<ImageURLs[]>([])
  const cancelButtonRef = useRef(null)
  async function savePicturesToDB(){
    const response=await fetch('/api/memories/saveImages',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            imageData:imageUrls,
            memoryId
        })
    })
    const data=await response.json()
    if(data.success){
        toast.success(data.message)
        fetchMemoryImages()
        setOpen(false)
    }
    else{
        toast.error(data.message)
    }
    setImageUrls([])
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
              <div className='p-10 text-black'>
                <h1 className='font-bold text-xl mb-4'>Upload Image.</h1>
              <CldUploadWidget uploadPreset="memories" onSuccess={(results:any)=>{
            setImageUrls((prevImageUrl:ImageURLs[])=>[...prevImageUrl,{fileName:results?.info?.original_filename,fileUrl:results?.info?.secure_url}])
        }}>
  {({ open, isLoading }) => {
    return (
        <>
        {isLoading?
        <button className='flex p-2 bg-pink-600 rounded-md text-white font-bold'>
            <span className='ml-2'>Loading...</span>
        </button>
        :
        <button className='flex p-2 bg-pink-600 rounded-md text-white font-bold' onClick={() => open()}>
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
<div className='mt-4 flex flex-wrap'>
    {
        imageUrls?.map((url,idx)=>(
          <div  key={idx} className='m-2 flex'>
            <Image src={url.fileUrl} alt={url.fileName} height={200} width={140}/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="size-5 mt-[-1rem] bg-red-500 rounded-xl cursor-pointer" onClick={()=>{
              let removedCurrentImage=imageUrls.filter((imageUrl:any)=>imageUrl.fileUrl!==url.fileUrl)
              setImageUrls([...removedCurrentImage])
            }}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
            </div>
        ))
    }
</div>
<div className='flex mt-10 justify-end'>
<button className='flex p-2 border-2 border-pink-600 rounded-md text-black font-bold mr-2' onClick={()=>setOpen(false)}>
            <span className='ml-2'>Cancel</span>
        </button>
<button className='flex p-2 bg-pink-600 rounded-md text-white font-bold' onClick={()=>savePicturesToDB()}>
            <span className='ml-2'>Save Images</span>
        </button>
</div>
</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
