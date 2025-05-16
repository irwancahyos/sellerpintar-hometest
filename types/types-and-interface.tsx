// ******** Imports ********
import { UniqCategory } from "@/app/user/article/page";
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
  inputStyleFromComponent?: string;
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
  inputStyleFromComponent?: string;
}

// Interface for general button
export interface ButtonProps {
  styles?: string;
  text?: string;
  img?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; 
  patchName?: string;
  type?: "submit" | "reset" | "button" | undefined;
}


// ******** Interface Admin Start ********
export interface Category {
  id?: string;
  userId?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id?: string;
  username?: string;
}

export interface Article {
  id?: string;
  userId?: string;
  categoryId?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  user?: User;
}

export interface Articles {
  data?: Article[];
  limit?: number;
  page?: number;
  total?: number;
}

// ******** Interface Admin End ********
export interface UserProfile {
  id: string;
  role?: string;
  username?: string
}

export interface Categorys {
  data?: Category[];
  totalData?: number;
  totalPages?: number;
  currentPage?: number;
  name?: string;
  id?: string;
}


// ******** Misc Interface ********
export interface EditData {
  articleId: string;
  articleContent: string;
  articleTitle: string;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
}

export interface Footer {
  title?: string;
  profileText?: string;
  style?: string;
  wraperProfileStyle?: string;
  imgStyle?: string;
  profileTextStyle?: string; 
  wrapperTitleStyle?: string;
  titleStyle?: string;
  profilePict?: string;
  logoUrl?: string; 
  logoStyle?: string; 
}

export interface Header {
  title?: string;
  profileText?: string;
  style?: string;
  wraperProfileStyle?: string;
  imgStyle?: string;
  profileTextStyle?: string; 
  wrapperTitleStyle?: string;
  titleStyle?: string;
  profilePict?: string;
  logoUrl?: string; 
  logoStyle?: string; 
  category?: Categorys;
  logoClickable?: boolean;
  logoRedirectTo?: string;
  dropdown?: string;
  hamburgerMenu?: boolean;
  handleNavbarClicked?: () => void;
}

export interface QuillEditorComponentProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}