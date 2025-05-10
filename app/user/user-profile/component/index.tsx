'use client'

// ******** Imports ********
import HeaderComponent from "@/components/header/header";
import logoImageUrlColor from "../../../../assets/logo.png";
import { UserProfile } from "@/types/types-and-interface";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/service/admin-service/admin-service";
import GeneralButton from "@/components/button/general-button";
import FooterComponent from "@/components/footer";
import logoFooterImageUrl from '../../../../assets/image.png';
import { useRouter } from "next/navigation";

// ******** Component declaration ********
function UserProfileComponent() {

  // ******** Local component state declaration ********
  const [userProfile, setUserProfile] = useState<UserProfile>();

  // ******** Local component variable declaration ********
  const router = useRouter();

  /**
   * Get user profile to display in the header component
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      const data = await getUserProfile();
      setUserProfile(data);
    };

    fetchUserProfile();
  }, []);

  /**
   * Fuction back to article list
   */
  const handleButtonBack = () => {
    router.push('/user/article');
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* Call header component */}
      <HeaderComponent
        style="w-full bg-[#F9FAFB] h-[68px] flex justify-between items-center px-10 border-b border-b-[#E2E8F0]"
        wraperProfileStyle="flex gap-1 items-center"
        imgStyle="bg-[#BFDBFE] flex justify-center font-semibold text-[#1E3A8A] items-center rounded-full h-[32px] w-[32px]"
        titleStyle="font-bold text-lg"
        profileTextStyle={`underline font-semibold max-[640px]:hidden text-black text-sm cursor-pointer opacity-80`}
        logoUrl={logoImageUrlColor?.src}
        logoStyle="w-[7rem] opacity-80"
        profileText={userProfile?.username}
        dropdown={'yes'}
      />

      {/* main component */}
      <div className="w-full flex-grow flex justify-center items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-[#0F172A] text-xl font-semibold">User Profile</h1>
            <div className="bg-[#BFDBFE] flex justify-center text-2xl font-semibold text-[#1E3A8A] items-center rounded-full h-[68px] w-[68px]">
              {userProfile?.username?.substring(0, 1).toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">

            {/* username */}
            <div className="w-[368px] max-[500px]:w-[80vw] h-[44px] rounded-[6px] bg-[#F3F4F6] border border-[#E2E8F0] flex py-[10px] px-[12px]">
              <p className="w-[26%] max-[500px]:w-[35%] text-[#111827] font-semibold">Username</p>
              <span className="w-[5%] max-[500px]:w-[10%]">:</span>
              <p className="w-[69%] max-[500px]:w-[50%] text-[#0F172A] text-center">{userProfile?.username}</p>
            </div>

            {/* password */}
            <div className="w-[368px] h-[44px] max-[500px]:w-[80vw] rounded-[6px] bg-[#F3F4F6] border border-[#E2E8F0] flex py-[10px] px-[12px]">
              <p className="w-[26%] max-[500px]:w-[35%] text-[#111827] font-semibold">Password</p>
              <span className="w-[5%] max-[500px]:w-[10%]">:</span>
              <p className="w-[69%] max-[500px]:w-[50%] text-[#0F172A] text-center">XXXXXX</p>
            </div>

            {/* role */}
            <div className="w-[368px] h-[44px] max-[500px]:w-[80vw] rounded-[6px] bg-[#F3F4F6] border border-[#E2E8F0] flex py-[10px] px-[12px]">
              <p className="w-[26%] max-[500px]:w-[35%] text-[#111827] font-semibold">Role</p>
              <span className="w-[5%] max-[500px]:w-[10%]">:</span>
              <p className="w-[69%] max-[500px]:w-[50%] text-[#0F172A] text-center">{userProfile?.role}</p>
            </div>

            {/* button back */}
            <GeneralButton onClick={handleButtonBack} styles="bg-[#2563EB] max-[500px]:w-[80vw] cursor-pointer rounded-md w-full text-white text-sm px-2 py-[0.7rem] hover:opacity-80 mt-3" text="Back to home" />
          </div>
        </div>
      </div>

      <FooterComponent
        style="w-full bg-[#2563EBDB] mt-8 min-h-[68px] max-[555px]:gap-0 max-[555px]:py-3 flex max-[555px]:flex-col justify-center gap-4 items-center px-16 max-[500px]:px-5"
        wraperProfileStyle="flex gap-1 items-center"
        titleStyle="font-bold text-lg"
        profileTextStyle="underline font-semibold text-sm cursor-pointer"
        logoUrl={logoFooterImageUrl?.src}
        logoStyle="w-[7rem]"
        imgStyle="text-white"
        profileText="© 2025 Blog genzet. All rights reserved."
      />
    </div>
  );
}

// ******** Export Declaration ********
export default UserProfileComponent;