'use client'
// ******** Imports ********
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputTypeText from "@/components/input/input-text";
import GeneralButton from "@/components/button/general-button";
import InputPassword from "@/components/input/input-password";
import LogoImage from "../../../../assets/logo.png";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { loginUser } from "@/lib/api/auth";

// ******** Component Declaraion ********
function LoginComponent() {

  // state declaration 
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  // creating a schema for strings
  const loginSchema = z.object({
    username: z.string().nonempty("Username field cannot be empty"),
    password: z.string().nonempty("Password field cannot be empety").min(8, "Password must be at least 8 characters long"),
  });

  // Form initialization
  const {
    formState: { errors, isValid },
    control,
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: 'all',
  });

  /**
   * Function to handle when eye icon in the input password clicked
   */
  const handleEyeClicked = () => {
    setIsEyeOpen(!isEyeOpen);
  }

  /**
   * Function to handle when form submited
   */
  const handleFormSubmit = async () => {
    // get the value
    const formValue = control?._formValues;

    // check is all form already filled 
    if(isValid) {
      try {
        const res = await loginUser({
          username: formValue?.username,
          password: formValue?.password,
          role: formValue?.role
        })

        const { token, role } = res;

        // update role and toke to cookie in the application
        document.cookie = `token=${token}; path=/;`;
        document.cookie = `role=${role}; path=/;`;

        toast.success("Login successfully");

        // redirect user base on role 
        if (role === 'Admin') {
          window.location.href = '/admin/category';
        } else if (role === 'User') {
          window.location.href = '/user/category';
        }
      } catch(e) {
        toast.error("Failed Register");
      }
    } 
    // reset form
    reset();
  }

  return ( 
    <>
      <div className="w-[400px] min-h-[376px] bg-[#FFFFFF] max-[500px]:w-full max-[500px]:flex max-[500px]:items-center max-[500px]:flex-col max-[500px]:p-0 max-[500px]:px-7 max-[500px]:justify-center max-[500px]:rounded-none max-[500px]:min-h-screen rounded-[12px] p-4">
        {/* Login Title Section */}
        <header className="w-full mt-5 max-[500px]:mt-0 flex justify-center items-center mb-5">
          <img className="w-[7rem] max-[500px]:w-[8rem]" src={LogoImage?.src} alt="Image of header login" />
        </header>

        {/* Login Form Section */}
        <form className="w-full pb-4">

          {/* Input Username Section */}
          <div>
            <label className="text-sm font-semibold">Username</label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputTypeText
                  onChange={onChange}
                  errorMessage={errors?.username?.message}
                  onBlur={onBlur}
                  value={value}
                  placeholder="Input username"
                  inputStyle="focus:outline-none w-full h-[2.2rem] text-sm p-[0.4rem]"
                  inputStyleFromComponent="flex items-center border-1 min-w-full p-[0.1rem] rounded-md focus:outline"
                  type="text"
                />
              )}
              name="username"
            />
          </div>

          {/* Input Password Section */}
          <div className="mt-3">
            <label className="text-sm font-semibold">Password</label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputPassword
                  onChange={onChange}
                  errorMessage={errors?.password?.message}
                  onBlur={onBlur}
                  value={value}
                  type={isEyeOpen ? 'text' : 'password'}
                  preffixIcon={
                    isEyeOpen ? (
                      <Eye className="cursor-pointer opacity-50" onClick={handleEyeClicked} size={16} />
                    ) : (
                      <EyeOff className="cursor-pointer opacity-50" onClick={handleEyeClicked} size={16} />
                    )
                  }
                  inputStyle="focus:outline-none w-full text-sm h-[2.2rem] p-[0.4rem]"
                  placeholder="Input password"
                />
              )}
              name="password"
            />
          </div>

          {/* Button Submit Section */}
          <div className="mt-7">
            <GeneralButton onClick={handleSubmit(handleFormSubmit)} styles="bg-[#2563EB] cursor-pointer rounded-sm w-full text-white text-sm px-2 py-[0.45rem]" text="Login" />
          </div>

          {/* Redirect Login Section */}
          <div className="mt-7">
            <p className="text-center text-sm">
              Don't have an account ?
              <span className="ml-1">
                <GeneralButton patchName="/register" styles="underline text-blue-700" text="Register" />
              </span>
            </p>
          </div>
        </form>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
}

// ******** Export Declaration ********
export default LoginComponent;