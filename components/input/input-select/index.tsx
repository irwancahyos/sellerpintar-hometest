'use client';

// ******** Iports ********
import { useState } from "react";
import { InputSelect, SelectRole } from "@/types/types-and-interface";

// ******** Component Declaration ********
const InputTypeSelect = ({placeholder, suffixIcon, prefixIcon, onBlur, value, errorMessage, onChange, inputStyle, dropDownValue, inputStyleFromComponent}: SelectRole) => {

  // State declaration
  const [isUserSelected, setIsUserSelected] = useState(false);

  /**
   * This function handle how to render placeholder in the select value
   * when user already select an value it will make the isUserSelected true, so hidden option placeholder and make opacity 100
   */
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Re-assign isUserSelected state
    setIsUserSelected(Boolean(event?.target?.value));

    // Call onChange from props
    onChange?.(event);
  };
   
  // Define the style for the inputText
  const inputStyles = ` ${errorMessage ? 'border-red-500' : 'border-[#E2E8F0]'}`;

  return (
    <>
      <div className={`${inputStyles} ${inputStyleFromComponent}`}>
        {suffixIcon && <span>{suffixIcon}</span>}
        <select onBlur={onBlur} value={value} onChange={handleSelectChange} className={`${inputStyle} ${!isUserSelected ? 'opacity-50' : 'opacity-100'}`}>
          {/* add placeholder manual */}
          <option className={`${isUserSelected && 'hidden'}`} value="">{placeholder}</option>
          {dropDownValue?.map((el: InputSelect) => (
            <option key={el?.value} value={el?.value}>{el?.label}</option>
          ))}
        </select>
        {prefixIcon && <span>{prefixIcon}</span>}
      </div>
      {errorMessage && <p className="text-sm ml-1 text-red-500">{errorMessage}</p>}
    </>
  );
};

// ******** Export Declaration ********
export default InputTypeSelect;

