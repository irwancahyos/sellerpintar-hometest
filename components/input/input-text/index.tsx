'use client';

// ******** Iports ********
import { InputText } from "@/types/types-and-interface";

// ******** Component Declaration ********
const InputTypeText = ({
  type,
  placeholder,
  suffixIcon,
  prefixIcon,
  onBlur,
  value,
  errorMessage,
  onChange,
  inputStyle,
  inputStyleFromComponent
}: InputText) => {

  // Custom blur handler to manage both the focus state and form props
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event); // Call form's onBlur if provided
  };

  return (
    <>
      <div className={`${inputStyleFromComponent}`}>
          {suffixIcon && (<span>{suffixIcon}</span>)}
        <input
          type={type}
          onBlur={handleBlur}
          onChange={onChange}
          className={inputStyle}
          placeholder={placeholder}
          value={value}
        />
        {prefixIcon && (<span>{prefixIcon}</span>)}
      </div>
      {errorMessage && <p className="text-sm ml-1 text-red-500">{errorMessage}</p>}
    </>
  );
};

// ******** Export Declaration ********
export default InputTypeText;

// flex items-center border-1 min-w-full p-[0.1rem] rounded-md focus:outline