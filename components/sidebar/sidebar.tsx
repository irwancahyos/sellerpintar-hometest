'use client'

// ******** Export Declaration ********
import LogoImage from '../../assets/image.png';
import { redirect, usePathname } from 'next/navigation'
import { LogOut, NewspaperIcon, TagIcon, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AlertDialogCategory } from '../alert-popup/alert-popup';

// ******** Local interface ********
interface SidebarComponent {
  isOpenNav?: boolean;
  handleNavbarClicked?: () => void;
}

function SidebarComponent({isOpenNav, handleNavbarClicked}: SidebarComponent) {

  // ******** Local component state declaration ********
  const [swetAlert, setSwetAlert] = useState({
    open: false,
    title: '',
    description: '',
    firstButtonText: '',
    secondButtonText: '',
    responValue: '',
    id: '',
  });
  const [isSmallScreen ,setIsSmallScreen] = useState(false);
  
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

  /**
   * function to set show logo white or blue
   */
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
      if (window.innerWidth < 500) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  /**
   * function to redirect page or logOut 
   */
  const handleSidebarClick = (routh:string) => {
    if(routh !== 'logout') {

      // also check when in the sidebar hiden mode, it will directly close the sidebar
      if(isSmallScreen && handleNavbarClicked) {
        handleNavbarClicked()
      }

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
    <div className={`max-[1070px]:relative`}>
      <aside
        className={`w-[267px] bg-[#2563EB] p-5 max-[1070px]:absolute min-h-screen max-[1070px]:z-50 duration-1000 ${isOpenNav ? 'left-0' : '-left-[20rem]'}`}
      >
        <div className='max-[1070px]:flex max-[1070px]:justify-between max-[1070px]:items-center'>
          <img className="w-[8rem] max-[500px]:w-[8rem]" src={LogoImage?.src} alt="Image of header login" />
          <X onClick={handleNavbarClicked} size={26} color='white' className='min-[1070px]:hidden cursor-pointer hover:opacity-70' />
        </div>
        <ul className="space-y-2 mt-5">
          {sidebarContent.map((el: { label: string; href: string; icon: React.ReactNode }, i) => (
            <li
              key={el?.label}
              onClick={() => handleSidebarClick(el?.href)}
              className={`w-full h-full text-white cursor-pointer flex pl-3 p-2 gap-3 rounded-md items-center ${
                activeIndex === i ? 'bg-[#3B82F6]' : ''
              }`}
            >
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
    </div>
  );
}

export default SidebarComponent;
