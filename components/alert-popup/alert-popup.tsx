// ******** Imports ********
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';

// ******** Local Interface Declaration ********
interface DialogWrapperProps {
  open?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  footer?: ReactNode;
  onDialogClose?: (responValue: boolean) => void;
  description?: string;
}

// ******** Component Declaration ********
export function AlertDialogCategory({ open, onClose, onConfirm, title, description, onDialogClose }: DialogWrapperProps) {
  /**
   * wrap the cancel so we call both onClose and onDialogClose(false)
   */
  const handleCancel = () => {
    onDialogClose?.(false);
    onClose?.();
  };

  /**
   * wrap confirm so we call both onDialogClose(true) and onConfirm/onClose
   */
  const handleConfirm = () => {
    onDialogClose?.(true);
    onConfirm?.();
    onClose?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      {/* Make when click outside alert not close alert */}
      <AlertDialogContent onFocusOutside={(e) => e.preventDefault()}>
        {/* Alert Header */}
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* Alert Button */}
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer hover:opacity-80" onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className={`cursor-pointer hover:opacity-80 ${title === 'Logout' ? 'bg-[#2563EB]' : 'bg-[#DC2626]'}`} onClick={handleConfirm}>
            {title === 'Logout' ? 'Logout' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
