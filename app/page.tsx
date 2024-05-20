'use client'
import Image from "next/image";

import toast from "react-hot-toast";
import Navbar from "./ui/Navbar";
import MemoryCard from "./ui/MemoryCard";

export default function Home() {
  
  return (
    <>
    <div className="flex flex-wrap">
   {
    [...Array(6)].map((item,idx)=>(
      <MemoryCard key={idx}/>
    ))
   }
</div>
 </>
  );
}
