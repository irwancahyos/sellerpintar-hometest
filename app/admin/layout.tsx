'use client'

// ******** Imports ********
import HeaderComponent from '@/components/header/header';
import SidebarComponent from '@/components/sidebar/sidebar';
import { getUserProfile } from '@/service/admin-service/admin-service';
import { UserProfile } from '@/types/types-and-interface';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// ******** Component Declaration ********
export default function UserLayout({ children }: { children: React.ReactNode }) {
  // ******** Local component state declaration ********
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [openNavbar, setOpenNavbar] = useState(false);

  // ******** Local component variable declaration ********
  const currentRoute = usePathname();
  let patchName = '';

  // send the header title base on route 
  if(currentRoute.startsWith('/admin/article')) {
    patchName = 'Articles'
  } else if (currentRoute.startsWith('/admin/category')) {
    patchName = 'Category'
  }

  // ******** React hooks useEffect declaration ********

  /**
   * Get user profile to display in the header component
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      const data = await getUserProfile();
      setUserProfile(data)
    }

    fetchUserProfile();
  }, [])

  /**
   * Set navbar open or hide
   */
  const handleNavbarIconClicked = () => {
    setOpenNavbar(!openNavbar);
  }


  return (
    <div className="min-[1070px]:flex min-h-screen">
      {/* Sidebar khusus user */}
      <SidebarComponent handleNavbarClicked={handleNavbarIconClicked} isOpenNav={openNavbar} />

      {/* Main content */}
      <main className="flex-1 bg-[#F3F4F6]">
        <HeaderComponent
          style="w-full bg-[#F9FAFB] h-[68px] flex justify-between items-center px-5 border-b border-b-[#E2E8F0]"
          wraperProfileStyle="flex gap-1 items-center"
          imgStyle="bg-[#BFDBFE] flex justify-center font-semibold text-[#1E3A8A] items-center rounded-full h-[32px] w-[32px]"
          titleStyle="font-bold text-lg"
          profileTextStyle="underline font-semibold text-sm cursor-pointer"
          title={patchName}
          profileText={userProfile?.username}
          hamburgerMenu={true}
          handleNavbarClicked={handleNavbarIconClicked}
        />

        <div className='w-full h-[calc(100vh-68px)] bg-[#F3F4F6] max-[750px]:min-h-screen p-[24px] max-[750px]:overflow-x-auto overflow-y-auto'>
          {children}
        </div>
      </main>
    </div>
  );
}