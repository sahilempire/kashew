"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  User,
  Building,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Globe,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0">
                <TabsTrigger
                  value="profile"
                  className="justify-start px-4 py-2 h-10 rounded-lg data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="justify-start px-4 py-2 h-10 rounded-lg data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
                >
                  <Building className="mr-2 h-4 w-4" />
                  Company
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="justify-start px-4 py-2 h-10 rounded-lg data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start px-4 py-2 h-10 rounded-lg data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="justify-start px-4 py-2 h-10 rounded-lg data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="justify-start px-4 py-2 h-10 rounded-lg data-[state=active]:bg-vibrant-yellow data-[state=active]:text-black"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Appearance
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="md:w-3/4 space-y-6">
              <TabsContent value="profile" className="space-y-6 mt-0">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="(555) 123-4567"
                      />
                    </div>
                    <div className="pt-4">
                      <Button className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-6 mt-0">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Update your company details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Company Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        defaultValue="info@acme.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input
                        id="companyPhone"
                        type="tel"
                        defaultValue="(555) 987-6543"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Address</Label>
                      <Textarea
                        id="companyAddress"
                        defaultValue="123 Business St, Suite 100, San Francisco, CA 94107"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                      <Input id="taxId" defaultValue="US123456789" />
                    </div>
                    <div className="pt-4">
                      <Button className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6 mt-0">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            Current Plan: Professional
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            $29/month, billed monthly
                          </p>
                        </div>
                        <Button variant="outline" className="rounded-full">
                          Change Plan
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="p-4 border rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/2025
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Billing Address</Label>
                      <div className="p-4 border rounded-lg">
                        <p>John Doe</p>
                        <p>Acme Inc.</p>
                        <p>123 Business St, Suite 100</p>
                        <p>San Francisco, CA 94107</p>
                        <p>United States</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
                        Update Billing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 mt-0">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Email Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="invoice-created">
                              Invoice Created
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when a new invoice is created
                            </p>
                          </div>
                          <Switch id="invoice-created" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="payment-received">
                              Payment Received
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when a payment is received
                            </p>
                          </div>
                          <Switch id="payment-received" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="invoice-overdue">
                              Invoice Overdue
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when an invoice becomes overdue
                            </p>
                          </div>
                          <Switch id="invoice-overdue" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails">
                              Marketing Emails
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about new features and offers
                            </p>
                          </div>
                          <Switch id="marketing-emails" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        System Notifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="browser-notifications">
                              Browser Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications in your browser
                            </p>
                          </div>
                          <Switch id="browser-notifications" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-0">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm New Password
                          </Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="mt-2 rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Two-Factor Authentication
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="two-factor">
                              Enable Two-Factor Authentication
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch id="two-factor" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Session Management
                      </h3>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Active Sessions</p>
                            <p className="text-sm text-muted-foreground">
                              You're currently logged in on 2 devices
                            </p>
                          </div>
                          <Button variant="outline" className="rounded-full">
                            Manage Sessions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6 mt-0">
                <Card className="modern-card">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize how Kashew looks for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Theme</h3>
                      <div className="flex items-center gap-4">
                        <Label>Select Theme:</Label>
                        <ThemeSwitcher />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Language</h3>
                      <div className="space-y-2">
                        <Label htmlFor="language">Select Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger
                            id="language"
                            className="w-full md:w-[240px]"
                          >
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Date & Time Format
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger
                            id="date-format"
                            className="w-full md:w-[240px]"
                          >
                            <SelectValue placeholder="Select Date Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="rounded-full bg-vibrant-yellow text-black hover:bg-vibrant-yellow/90">
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
