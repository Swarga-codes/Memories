'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
function classNames(...classes:string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function Navbar() {
  const router=useRouter()
  const [profilePic,setProfilePic]=useState("")
  const pathname=usePathname()
  const publicRoutes=['/login','/register','/verifyOtp','/forgotPassword']
    async function fetchUserData() {
      const response=await fetch('/api/users/getUserData')
      const data=await response.json()
      if(data.success){
          setProfilePic(data?.userData?.profilePic)
          localStorage.setItem('profilePic',data?.userData?.profilePic)
      }
      else{
          toast.error(data.message)
      }
  }
  async function logout(){
    const response=await fetch('/api/auth/logout',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
    })
    const data=await response.json()
    if(data.success){
      toast.success(data.message)
      router.push('/login')
    }
  }
  useEffect(()=>{
  if(!publicRoutes.includes(pathname)){
    fetchUserData()
  }
  },[])
  useEffect(()=>{
    if(typeof localStorage!==undefined){
      setProfilePic(localStorage.getItem('profilePic') || "")
    }
  },[])
  if(publicRoutes.includes(pathname)){
    return
  }
  return (
    <>
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
            <Link href={'/'}>
              <div className='flex items-center'>
                <Image src={'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-memories-history-flaticons-lineal-color-flat-icons.png'} alt='memoryIcon' height={32} width={32}/>
                <h1 className='font-bold ml-2'>Memories.</h1>
                </div>
                </Link>
              
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="w-auto"
                    src="https://tailwindui.com/Image/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                    width={8}
                    height={8}
                  />
                </div>
                
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  
                </button>
              
                       

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={profilePic?profilePic:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt="profile_pic"
                        height={16}
                        width={16}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/userProfile"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                     
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            onClick={()=>{ if(window.confirm('Do you really wish to logout?')){
                                logout()
                              }
                             }}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

        
        </>
      )}
    </Disclosure>
    </>
  )
}
