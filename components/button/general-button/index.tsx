"use client";

// ******** Imports ********
import { ButtonProps } from "@/types/types-and-interface";
import Link from "next/link";

// ******** Component Declaration ********
const GeneralButton = ({styles, text, img, onClick, disabled = false, patchName, type}: ButtonProps) => {
  return (
    <>
      {!patchName && (
        <button type={type} disabled={disabled} onClick={onClick} className={styles}>
          {img && img}
          {text}
        </button>
      )}

      {patchName && (
        <Link className={styles} href={patchName}>
          {text}
        </Link>
      )}
    </>
  );
};

// ******** Export Declaration ********
export default GeneralButton;
