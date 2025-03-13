"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  MoreHorizontal,
  ShoppingBag,
  Package,
  Loader2,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AddProductModal from "@/components/modals/AddProductModal";
import { useAuth } from "@/contexts/AuthContext";
import { productService } from "@/lib/database";
import { Product } from "@/lib/models";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "products" | "services">("all");

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user, activeTab]);

  const loadProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let data: Product[];
      
      if (activeTab === "products") {
        data = await productService.getAll(user.id, "product");
      } else if (activeTab === "services") {
        data = await productService.getAll(user.id, "service");
      } else {
        data = await productService.getAll(user.id);
      }
      
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) {
      await loadProducts();
      return;
    }
    
    try {
      setLoading(true);
      let data: Product[];
      
      if (activeTab === "products") {
        data = await productService.search(user.id, searchQuery, "product");
      } else if (activeTab === "services") {
        data = await productService.search(user.id, searchQuery, "service");
      } else {
        data = await productService.search(user.id, searchQuery);
      }
      
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Failed to search products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await productService.create(user.id, {
        ...data,
        type: "product"
      });
      await loadProducts();
      setAddProductOpen(false);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (data: any) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await productService.create(user.id, {
        ...data,
        type: "service"
      });
      await loadProducts();
      setAddServiceOpen(false);
    } catch (err) {
      console.error("Error adding service:", err);
      setError("Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user) return;
    
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setLoading(true);
        await productService.delete(user.id, id);
        await loadProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete item. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewProduct = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleEditProduct = (id: string) => {
    router.push(`/products/${id}/edit`);
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
              className="gap-2 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90"
              onClick={() => setAddProductOpen(true)}
            >
              <Package className="h-4 w-4" />
              Add Product
            </Button>
            <Button
              className="gap-2 rounded-full bg-vibrant-green text-white hover:bg-vibrant-green/90"
              onClick={() => setAddServiceOpen(true)}
            >
              <Package className="h-4 w-4" />
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
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as "all" | "products" | "services")}>
            <div className="p-6 pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search items..."
                      className="w-full sm:w-[250px] pl-8 rounded-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-6 text-red-500">
                {error}
              </div>
            )}

            <TabsContent value="all" className="p-6 pt-0">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-vibrant-yellow" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No items found matching your search." : "No products or services yet. Add your first item to get started."}
                </div>
              ) : (
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
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 ${product.type === "product" ? "bg-vibrant-yellow text-black" : "bg-vibrant-green text-white"}`}
                          >
                            {product.type === "product" ? "Product" : "Service"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{product.description || '-'}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>{product.taxRate ? `${product.taxRate}%` : '-'}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="products" className="p-6 pt-0">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-vibrant-yellow" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No products found matching your search." : "No products yet. Add your first product to get started."}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{product.description || '-'}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>{product.taxRate ? `${product.taxRate}%` : '-'}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="services" className="p-6 pt-0">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-vibrant-yellow" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No services found matching your search." : "No services yet. Add your first service to get started."}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{product.description || '-'}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>{product.taxRate ? `${product.taxRate}%` : '-'}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
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
