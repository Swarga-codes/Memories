import Image from 'next/image'
import React from 'react'

export default function MemoryCard() {
  return (
    <div className="relative h-[400px] w-[360px] rounded-md my-4 mx-2 cursor-pointer">
      <Image
        src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
        alt="AirMax Pro"
        className="z-0 h-full w-full rounded-md object-cover"
        height={8}
        width={8}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">Memory name</h1>
        <p className="mt-2 text-sm text-gray-300">
         Memory Description
        </p>
        <button className="mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-white">
          Relive Memory &rarr;
        </button>
      </div>
    </div>
  )
}
