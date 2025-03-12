"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  MoreHorizontal,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AddProductModal from "@/components/modals/AddProductModal";

export default function ProductsPage() {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);

  // Products data
  const productsData = [
    {
      id: "1",
      name: "Website Design",
      type: "Service",
      description: "Custom website design and development",
      price: 2500.0,
      unit: "Project",
      taxRate: 10,
    },
    {
      id: "2",
      name: "Logo Design",
      type: "Service",
      description: "Professional logo design with revisions",
      price: 800.0,
      unit: "Project",
      taxRate: 10,
    },
    {
      id: "3",
      name: "SEO Optimization",
      type: "Service",
      description: "Search engine optimization services",
      price: 1200.0,
      unit: "Month",
      taxRate: 10,
    },
    {
      id: "4",
      name: "Content Writing",
      type: "Service",
      description: "Professional content writing services",
      price: 120.0,
      unit: "Hour",
      taxRate: 10,
    },
    {
      id: "5",
      name: "Web Hosting",
      type: "Product",
      description: "Premium web hosting package",
      price: 150.0,
      unit: "Year",
      taxRate: 10,
    },
    {
      id: "6",
      name: "Domain Name",
      type: "Product",
      description: "Domain name registration",
      price: 15.0,
      unit: "Year",
      taxRate: 10,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddProduct = (data: any) => {
    console.log("New product data:", data);
    // In a real app, we would add the product to the database
  };

  const handleAddService = (data: any) => {
    console.log("New service data:", data);
    // In a real app, we would add the service to the database
  };

  return (
    <DashboardLayout title="Products & Services">
      <div className="space-y-6 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Products & Services</h1>
            <p className="text-muted-foreground">
              Manage your products and services catalog
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-full"
              onClick={() => setAddProductOpen(true)}
            >
              <Package className="h-4 w-4" />
              Add Product
            </Button>
            <Button
              className="gap-2 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
              onClick={() => setAddServiceOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="modern-card bg-vibrant-yellow p-6">
            <div className="rounded-full bg-black/10 p-3 w-fit">
              <ShoppingBag className="h-6 w-6 text-black" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-black/70">Total Items</p>
              <h3 className="text-3xl font-bold text-black">6</h3>
              <p className="text-sm text-black/70 mt-1">Products & Services</p>
            </div>
          </div>

          <div className="modern-card bg-vibrant-pink p-6">
            <div className="rounded-full bg-black/10 p-3 w-fit">
              <ShoppingBag className="h-6 w-6 text-black" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-black/70">Services</p>
              <h3 className="text-3xl font-bold text-black">4</h3>
              <p className="text-sm text-black/70 mt-1">Items</p>
            </div>
          </div>

          <div className="modern-card bg-vibrant-green p-6">
            <div className="rounded-full bg-white/10 p-3 w-fit">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/70">Products</p>
              <h3 className="text-3xl font-bold text-white">2</h3>
              <p className="text-sm text-white/70 mt-1">Items</p>
            </div>
          </div>
        </div>

        <div className="modern-card bg-background">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Catalog</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search catalog..."
                  className="w-[250px] pl-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 ${product.type === "Service" ? "bg-vibrant-pink text-black" : "bg-vibrant-yellow text-black"}`}
                      >
                        {product.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {product.description}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>Per {product.unit}</TableCell>
                    <TableCell>{product.taxRate}%</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Item</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          open={addProductOpen}
          onOpenChange={setAddProductOpen}
          onSubmit={handleAddProduct}
          type="product"
        />

        {/* Add Service Modal */}
        <AddProductModal
          open={addServiceOpen}
          onOpenChange={setAddServiceOpen}
          onSubmit={handleAddService}
          type="service"
        />
      </div>
    </DashboardLayout>
  );
}
