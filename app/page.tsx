'use client'
import Image from "next/image";

import toast from "react-hot-toast";
import Navbar from "./ui/Navbar";
import MemoryCard from "./ui/MemoryCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter()
  const [memories,setMemories]=useState([])
  async function fetchMemories(){
    const response=await fetch('/api/memories/getUserMemories')
    const data=await response.json()
    if(data.success){
toast.success(data.message)
setMemories(data.memories)
    }
    else if(response.status===401){
      router.push('/login')
      toast.error(data.message)
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
