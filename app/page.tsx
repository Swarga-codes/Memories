'use client'
import Image from "next/image";

import toast from "react-hot-toast";
import Navbar from "./ui/Navbar";
import MemoryCard from "./ui/MemoryCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import CreateMemoryDialog from "./ui/CreateMemoryDialog";
export default function Home() {
  
  const [memories,setMemories]=useState([])
  const [userName,setUserName]=useState('')
  const [open, setOpen] = useState(false)
    
  async function fetchMemories(){
    const response=await fetch('/api/memories/getUserMemories')
    const data=await response.json()
    if(data.success){
setMemories(data.memories)
    }
    else{
      toast.error(data.message)
    }
  }
  useEffect(()=>{
fetchMemories();
  },[])
  useEffect(()=>{
    if(typeof localStorage!==undefined){
setUserName(localStorage.getItem('username'))
    }
  },[])
  return (
    <>
    <div className="p-10 flex">
      <div>
      <h1 className="text-4xl font-bold">Hello {userName}</h1>
      <p>Below you can find your memories....</p>
      </div>
      <div className="ml-auto">
        
      <button className='flex mr-6 border-2 border-blue-500 bg-blue-500 p-2 rounded-lg'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
<span className='font-bold ml-2' onClick={()=>setOpen(true)}>Create a Memory</span>
</button>        
      </div>
    </div>
    <div className="flex flex-wrap">
   {
    memories?.map((memory)=>(
      <Link href={`/memories/${memory._id}`} key={memory._id}><MemoryCard memory={memory}/></Link>
    ))
   }
</div>
<CreateMemoryDialog open={open} setOpen={setOpen} fetchMemories={fetchMemories}/>
 </>
  );
}
