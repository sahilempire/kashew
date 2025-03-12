import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddInvoiceForm from "@/components/invoices/AddInvoiceForm";

interface AddInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const AddInvoiceModal = ({
  open,
  onOpenChange,
  onSubmit = () => {},
}: AddInvoiceModalProps) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] modern-card">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your client.
          </DialogDescription>
        </DialogHeader>
        <AddInvoiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;
