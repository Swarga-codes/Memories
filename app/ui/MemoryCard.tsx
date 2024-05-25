'use client'
import Image from 'next/image'
import React from 'react'
import { Memory } from '../util/types'
interface MemoryCardProps{
  memory:Memory
}
export default function MemoryCard({memory}:MemoryCardProps) {
  return (
    <div className="relative h-[400px] w-[360px] rounded-md my-4 mx-2 cursor-pointer">
      <Image
      src={memory?.memoryCoverPic?memory?.memoryCoverPic:"https://images.unsplash.com/photo-1608085575931-d0bd0aacd0d1?q=80&w=1891&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        alt={memory?.title}
        className="z-0 h-full w-full rounded-md object-cover"
        height={200}
        width={150}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white">{memory?.title}</h1>
        <p className="mt-2 text-sm text-gray-300">
         {memory?.description}
        </p>
        <p className="mt-2 text-sm text-gray-300">
         {memory?.createdAt?.toString().substring(0,10)}
        </p>
        <button className="mt-2 inline-flex cursor-pointer items-center text-sm font-semibold text-white">
          Relive Memory &rarr;
        </button>
      </div>
    </div>
  )
}
