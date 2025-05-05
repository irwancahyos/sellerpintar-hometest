// ******** Imports ********
import { ReactNode } from "react";

// This interface use in the input tag in component input-text
export interface InputText {
  value?: string;
  type?: string;
  placeholder?: string;
  suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  errorMessage?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  inputStyle?: string
}

// This interface use in the input tag in component input-password
export interface InputPaassword {
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  suffixIcon?: React.ReactNode;
  preffixIcon?:React.ReactNode;
  inputStyle?: string;
}

// This interface use in the input tag in component input-placeholder
export type InputSelect = {
  value: string;
  label: string
}

// This interface use in the select tag in component select role
export interface SelectRole {
  value?: string;
  type?: string;
  placeholder?: string;
  suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  errorMessage?: string;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  inputStyle?: string;
  dropDownValue?: InputSelect[];
}

// Interface for general button
export interface ButtonProps {
  styles?: string;
  text?: string;
  img?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; 
  patchName?: string;
}