'use client'

// ******** Export Declaration ********
import LogoImage from '../../assets/image.png';
import { redirect, usePathname } from 'next/navigation'
import { LogOut, NewspaperIcon, TagIcon } from 'lucide-react';
import React, { useState } from 'react';
import { AlertDialogCategory } from '../alert-popup/alert-popup';

function SidebarComponent() {

  const [activeSidebar, setActiveSidebar] = useState(0);
  const [swetAlert, setSwetAlert] = useState({
    open: false,
    title: '',
    description: '',
    firstButtonText: '',
    secondButtonText: '',
    responValue: '',
    id: '',
  });
  
  // send the header title base on route 
  const pathname = usePathname();

  // derive index from the path
  const activeIndex =
    pathname.startsWith('/admin/article')  ? 0 :
    pathname.startsWith('/admin/category') ? 1 :
    -1;

  const sidebarContent = [
    {
      label: "Articles",
      href: '/admin/article',
      icon: <NewspaperIcon className='w-[20px] h-[20px]' />
    },
    {
      label: "Category",
      href: '/admin/category',
      icon: <TagIcon className='w-[20px] h-[20px]' />
    },
    {
      label: "Logout",
      href: 'logout',
      icon: <LogOut className='w-[20px] h-[20px]' />
    }
  ]

  const handleSidebarClick = (routh:string, i:number) => {
    if(routh !== 'logout') {
      setActiveSidebar(i);
      redirect(routh);
    } else {
      // delete cookie so it will make user logout
      setSwetAlert(prev => ({...prev, open: true, title: "Logout", description: `Are you sure want to logout?`}));
    }
  }

  /**
   * Function to handle when close alert category to know the respon value and when respon from confirmation is true then delete data category
   */
  const onDialogCloseRespon = async (responValue?: true | false) => {
    setSwetAlert((prev) => ({ ...prev, open: false }));
    if (responValue) {
      try {
        // Delete sesion and local storage and reload
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        localStorage.removeItem('token');

        // reset expired
        document.cookie = 'token=; Max-Age=0; path=/;';
        document.cookie = 'role=; Max-Age=0; path=/;';

        // reload page
        window.location.reload();
      } catch (e) {
        throw new Error(`Error when try to delete article: ${e}`);
      }
    }
  };

  /**
   * Handle when swal is closed
   */
  const handleCloseAlert = () => {
    setSwetAlert(prev => ({...prev, open: false}));
  }

  return (
    <>
      <aside className="w-[267px] bg-[#2563EB] p-5">
        <img className="w-[8rem] max-[500px]:w-[8rem]" src={LogoImage?.src} alt="Image of header login" />
        <ul className="space-y-2 mt-5">
          {sidebarContent.map((el: { label: string; href: string; icon: React.ReactNode }, i) => (
            <li key={el?.label} onClick={() => handleSidebarClick(el?.href, i)} className={`w-full h-full text-white cursor-pointer flex pl-3 p-2 gap-3 rounded-md items-center ${activeIndex === i ? 'bg-[#3B82F6]' : ''}`}>
              {el?.icon}
              {el?.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Alertt calling */}
      <AlertDialogCategory
        open={swetAlert?.open}
        description={swetAlert?.description}
        title={swetAlert?.title}
        onDialogClose={onDialogCloseRespon}
        onClose={handleCloseAlert}
      />
    </>
  );
}

export default SidebarComponent;
