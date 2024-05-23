'use client'
import Image from "next/image";

import toast from "react-hot-toast";
import Navbar from "./ui/Navbar";
import MemoryCard from "./ui/MemoryCard";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  
  const [memories,setMemories]=useState([])
  async function fetchMemories(){
    const response=await fetch('/api/memories/getUserMemories')
    const data=await response.json()
    if(data.success){
toast.success(data.message)
setMemories(data.memories)
    }
    else{
      toast.error(data.message)
    }
  }
  useEffect(()=>{
fetchMemories();
  },[])
  return (
    <>
    <div className="flex flex-wrap">
   {
    memories?.map((memory)=>(
      <Link href={`/memories/${memory._id}`}><MemoryCard key={memory._id} memory={memory}/></Link>
    ))
   }
</div>
 </>
  );
}
