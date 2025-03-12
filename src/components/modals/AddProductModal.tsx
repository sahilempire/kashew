import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddProductForm from "@/components/products/AddProductForm";

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
  type?: "product" | "service";
}

const AddProductModal = ({
  open,
  onOpenChange,
  onSubmit = () => {},
  type = "product",
}: AddProductModalProps) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] modern-card">
        <DialogHeader>
          <DialogTitle>
            {type === "product" ? "Add New Product" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {type === "product"
              ? "Add a new product to your catalog."
              : "Add a new service to your catalog."}
          </DialogDescription>
        </DialogHeader>
        <AddProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
