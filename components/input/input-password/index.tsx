'use client';

// ******** Imports ********
import { InputPaassword } from "@/types/types-and-interface";
import { useState } from "react";

// ******** Component Declaration ********
const InputPassword = ({ type, placeholder, errorMessage, onBlur, onChange, value, suffixIcon, preffixIcon, inputStyle }: InputPaassword) => {

  // Define state to handle when focus on field the field should be change the border
  const [isFocus, setIsFocus] = useState(false);

  // function to handle when user leave the field should be send onBlur and make the outline to be not focus
  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocus(false);
    onBlur?.(event);
  }

  return (
    <>
      <div className={`border-1 min-w-full flex items-center p-[0.1rem] pr-2 rounded-md animated-text focus: outline-none ${isFocus ? 'border-blue-600': 'border-[#E2E8F0]'}`}>
        {suffixIcon && <span>{suffixIcon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          onBlur={handleOnBlur}
          onFocus={() => setIsFocus(true)}
          className={inputStyle}
          onChange={onChange}
          value={value}
        />
        {preffixIcon && <span>{preffixIcon}</span>}
      </div>
      { errorMessage && <p className="text-sm ml-1 text-red-500">{errorMessage}</p> }
    </>
  );
};

// ******** Export Declaration ********
export default InputPassword;