'use client'

// ******** Imports ********
import GeneralButton from "@/components/button/general-button";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/types-and-interface";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/service/admin-service/admin-service";

// ******** Component Declaration ********
function UserProfileAdminComponent() {
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
    router.push('/admin/article');
  }

  return (
    <div className="w-full flex justify-center items-center min-h-full bg-white rounded-[12px]">
      {/* main component */}
      <div className="w-full flex justify-center items-center">
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
    </div>
  );
}

// ******** Export declaration ********
export default UserProfileAdminComponent;