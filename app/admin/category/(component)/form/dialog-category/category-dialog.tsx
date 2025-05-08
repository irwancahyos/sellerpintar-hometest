// ******** Imports ********
import GeneralButton from "@/components/button/general-button";
import InputTypeText from "@/components/input/input-text";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/types-and-interface";
import { createCategory, editCategory } from "@/service/admin-service/admin-service";


// ******** Local Interface ********
interface DialogWrapperProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  dataEdit?: Category;
  onDialogClose?: (reason: 'cancel' | 'submit') => void;
}

// ******** Function Declaration ********
function DialogCategoryForm({onOpenChange, open, title, onDialogClose, dataEdit}:DialogWrapperProps) {

  // ******** creating a schema for strings ********
  const loginSchema = z.object({
    category: z.string().nonempty("Category field cannot be empty")
  });

  // ******** Form initialization ********
  const {
    formState: { errors, isValid },
    control,
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      category: "",
    },
    mode: 'all',
  });

  // ******** React hooks useEffect declaration ********
  useEffect(() => {
    if (dataEdit) {
      // patch the form with dataEdit.name
      reset({ category: dataEdit?.name! }); 
    }
  }, [dataEdit, reset]);

  // ******** Function declaration ********

  /**
   * Handle close button with send information to parent the dialog just close without process a data
   */
  const handleCloseButton = () => {
    onOpenChange?.(false);
    onDialogClose?.('cancel');
    reset({ category: "" });
  }

  /**
   * Handle submit create category and tell the parent the close with process data so reload table to get latest data
   */
  const handleSubmitButtonDialog = async () => {
    const value = control?._formValues?.category;
    const error = dataEdit ? 'edit' : 'create'
    const idCategory = dataEdit?.id ?? '';

    if(isValid) {
      try {
        const res = !dataEdit ? await createCategory(value) : await editCategory(idCategory, value);
        onDialogClose?.('submit');
      } catch(e) {
        throw new Error(`Error when send ${error} category form component: ${e}`)
      } finally {
        onOpenChange?.(false);
        reset();
      }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[425px] min-h-[260px] [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {/* Dialog Input */}
          <div className="grid gap-4 py-4">
            <div className=" gap-4">
              <p className="mb-1">Category</p>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputTypeText
                    onChange={onChange}
                    onBlur={onBlur}
                    errorMessage={errors?.category?.message}
                    value={value}
                    inputStyle="focus:outline-none w-full h-[2.2rem] text-sm p-[0.4rem]"
                    inputStyleFromComponent="flex items-center border-1 min-w-full p-[0.1rem] rounded-md focus:outline"
                    placeholder="Input category"
                  />
                )}
                name="category"
              />
            </div>
          </div>

          {/* Dialog Button */}
          <DialogFooter>
            <GeneralButton
              onClick={handleCloseButton}
              styles="w-[74px] hover:opacity-80 cursor-pointer h-[40px] border-[#E2E8F0] border rounded-md"
              text="Cancel"
            />
            <GeneralButton
              onClick={handleSubmit(handleSubmitButtonDialog)}
              styles="min-w-[54px] hover:opacity-80 px-3 cursor-pointer h-[40px] bg-[#2563EB] text-white border-[#E2E8F0] border rounded-md"
              text={dataEdit ? 'Save change' : 'Add'}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ******** Export Declaration ********
export default DialogCategoryForm;