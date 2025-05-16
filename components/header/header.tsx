// ******** Imports ********
import { Header } from "@/types/types-and-interface";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Hamburger, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { AlertDialogCategory } from "../alert-popup/alert-popup";


// ******** Component Declaration ********
function HeaderComponent({style, title, wraperProfileStyle, imgStyle, profileTextStyle, wrapperTitleStyle, profileText, titleStyle, logoUrl, logoStyle, logoClickable, logoRedirectTo, dropdown, hamburgerMenu, handleNavbarClicked}: Header) {

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
  
  // ******** Local component variable declaration ********
  const router = useRouter();

  /**
   * Function handle to dashboard
   */
  const handleLogoClick = () => {
    if (logoClickable && logoRedirectTo) {
      router.push(logoRedirectTo);
    }
  };

  /**
   * Function handle to profile user
   */
  const handleGoToProfile = () => {
    router.push('/user/user-profile');
  }

  /**
   * Function handle to article list
   */
  const handleProfileClick = () => {
    router.push('/admin/user-profile', { scroll: false });
  };

  /**
   * Function handle logout
   */
  const handleLogOut = () =>  {
    setSwetAlert(prev => ({...prev, open: true, title: "Logout", description: `Are you sure want to logout?`}));
  }

  /**
   * Function delete local storage and session then reload
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
      <header className={`${style}`}>
        <div className={`title ${wrapperTitleStyle} ${hamburgerMenu && 'flex items-center gap-2'}`}>
          {hamburgerMenu && <Menu onClick={handleNavbarClicked} className="min-[1070px]:hidden cursor-pointer hover:opacity-70" size={27} />}
          {title && <h2 className={`title ${titleStyle}`}>{title}</h2>}
          {logoUrl && (
            <img
              className={`${logoStyle} ${logoClickable ? 'cursor-pointer' : ''}`}
              onClick={handleLogoClick}
              src={logoUrl}
              alt="this logo of header"
            />
          )}
        </div>

        {/* if dropdown variable type is 'yes' (because stuck when send boolean is always undefined), it will render profile when click appear menu dropdown */}
        {dropdown === 'yes' ? (
          <DropdownMenu>
            <div className="relative">
              <DropdownMenuTrigger asChild>
                <div className={`${wraperProfileStyle} profile cursor-pointer w-full`}>
                  <div className={`${imgStyle}`}>
                    <p>{profileText?.substring(0, 1).toUpperCase()}</p>
                  </div>
                  <p className={`${profileTextStyle}`}>{profileText}</p>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="mt-2 w-48 z-50 bg-white shadow-md border border-gray-200">
                <DropdownMenuItem onClick={handleGoToProfile} className="cursor-pointer">My Account</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer flex gap-2 items-center">
                  <LogOut size={16} className="text-[#EF4444]" />
                  <span className="text-[#EF4444]">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        ) : (
          <div className={`${wraperProfileStyle} profile cursor-pointer`} onClick={handleProfileClick}>
            <div className={`${imgStyle}`}>
              <p>{profileText?.substring(0, 1).toUpperCase()}</p>
            </div>
            <p className={`${profileTextStyle} max-[500px]:hidden`}>{profileText}</p>
          </div>
        )}
      </header>

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

// ******** Export Declaration ********
export default HeaderComponent;